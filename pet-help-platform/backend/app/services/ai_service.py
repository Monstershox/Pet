import openai
import base64
import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
import httpx
import os

from app.core.config import settings
from app.models import Animal, AnimalAnalysis

async def analyze_animal_photo(photo_url: str, animal_id: int, db: Session) -> Optional[AnimalAnalysis]:
    """Analyze animal photo using AI (OpenAI Vision API or similar)"""

    if not settings.OPENAI_API_KEY:
        return None

    try:
        openai.api_key = settings.OPENAI_API_KEY

        prompt = """Analyze this photo of an animal and provide the following information in JSON format:
        {
            "species": "dog/cat/bird/rabbit/other",
            "breed": "estimated breed or 'mixed'",
            "age_range": "puppy/kitten/young/adult/senior",
            "size": "small/medium/large",
            "color": "primary color(s)",
            "condition": "healthy/injured/malnourished/needs_care",
            "confidence_score": 0.0-1.0,
            "additional_notes": "any other relevant observations"
        }"""

        if photo_url.startswith("http"):
            image_url = photo_url
        else:
            with open(photo_url.replace("/uploads/", str(settings.UPLOAD_DIR) + "/"), "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
                image_url = f"data:image/jpeg;base64,{image_data}"

        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": image_url}}
                    ]
                }
            ],
            max_tokens=500
        )

        analysis_text = response.choices[0].message.content
        analysis_data = json.loads(analysis_text)

        new_analysis = AnimalAnalysis(
            animal_id=animal_id,
            ai_breed_detection=analysis_data.get("breed", "Unknown"),
            ai_condition_assessment=analysis_data.get("condition", "Unknown"),
            ai_age_estimation=analysis_data.get("age_range", "Unknown"),
            ai_confidence_score=float(analysis_data.get("confidence_score", 0.5)),
            raw_analysis_data=analysis_data
        )

        db.add(new_analysis)

        animal = db.query(Animal).filter(Animal.id == animal_id).first()
        if animal and not animal.breed:
            animal.breed = analysis_data.get("breed")
            if analysis_data.get("color"):
                animal.color = analysis_data["color"]

        db.commit()
        db.refresh(new_analysis)

        return new_analysis

    except Exception as e:
        print(f"AI analysis error: {e}")
        return None

async def generate_faq_answer(question: str) -> str:
    """Generate FAQ answer using AI"""

    if not settings.OPENAI_API_KEY:
        return "AI service is not configured. Please try again later."

    try:
        openai.api_key = settings.OPENAI_API_KEY

        prompt = f"""You are a helpful assistant for a pet adoption and rescue platform.
        Answer the following question about pet care, adoption, or animal welfare:

        Question: {question}

        Provide a clear, informative, and compassionate answer in 2-3 paragraphs."""

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a knowledgeable pet care expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"FAQ AI error: {e}")
        return "Sorry, I couldn't generate an answer at this time. Please try again later."

def match_lost_pets(animal_data: Dict[str, Any], db: Session) -> list:
    """Match found animals with lost pets database"""

    query = db.query(Animal).filter(
        Animal.status == "lost",
        Animal.type == animal_data.get("type")
    )

    if animal_data.get("breed"):
        query = query.filter(Animal.breed.ilike(f"%{animal_data['breed']}%"))

    if animal_data.get("color"):
        query = query.filter(Animal.color.ilike(f"%{animal_data['color']}%"))

    if animal_data.get("size"):
        query = query.filter(Animal.size == animal_data["size"])

    potential_matches = query.limit(10).all()

    matches = []
    for animal in potential_matches:
        match_score = calculate_match_score(animal_data, {
            "type": animal.type,
            "breed": animal.breed,
            "color": animal.color,
            "size": animal.size,
            "age": animal.age
        })

        if match_score > 0.7:
            matches.append({
                "animal_id": animal.id,
                "match_score": match_score,
                "owner_id": animal.owner_id
            })

    return sorted(matches, key=lambda x: x["match_score"], reverse=True)

def calculate_match_score(data1: Dict, data2: Dict) -> float:
    """Calculate similarity score between two animals"""
    score = 0.0
    total_weight = 0.0

    weights = {
        "type": 0.3,
        "breed": 0.25,
        "color": 0.2,
        "size": 0.15,
        "age": 0.1
    }

    for field, weight in weights.items():
        if data1.get(field) and data2.get(field):
            if data1[field] == data2[field]:
                score += weight
            elif isinstance(data1[field], str) and isinstance(data2[field], str):
                if data1[field].lower() in data2[field].lower() or data2[field].lower() in data1[field].lower():
                    score += weight * 0.5
            total_weight += weight

    return score / total_weight if total_weight > 0 else 0.0