from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from pathlib import Path
from PIL import Image
import io

from app.core.database import get_db
from app.core.config import settings
from app.models import User, Animal, AnimalPhoto
from app.api.v1.endpoints.auth import get_current_user
from app.services.ai_service import analyze_animal_photo

router = APIRouter()

UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(exist_ok=True)

def save_upload_file(upload_file: UploadFile, subfolder: str = "animals") -> tuple[str, str]:
    """Save uploaded file and return URLs"""
    file_extension = Path(upload_file.filename).suffix.lower()

    if file_extension not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed"
        )

    unique_filename = f"{uuid.uuid4()}{file_extension}"

    upload_path = UPLOAD_DIR / subfolder
    upload_path.mkdir(exist_ok=True)

    file_path = upload_path / unique_filename
    thumbnail_path = upload_path / f"thumb_{unique_filename}"

    file_content = upload_file.file.read()

    with open(file_path, "wb") as f:
        f.write(file_content)

    try:
        img = Image.open(io.BytesIO(file_content))
        img.thumbnail((300, 300))
        img.save(thumbnail_path)
    except:
        thumbnail_path = file_path

    file_url = f"/uploads/{subfolder}/{unique_filename}"
    thumbnail_url = f"/uploads/{subfolder}/thumb_{unique_filename}"

    return file_url, thumbnail_url

@router.post("/animal/{animal_id}/photo")
async def upload_animal_photo(
    animal_id: int,
    file: UploadFile = File(...),
    is_primary: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found"
        )

    if animal.owner_id != current_user.id and current_user.role not in ["admin", "shelter_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload photos for this animal"
        )

    if file.size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE} bytes"
        )

    try:
        file_url, thumbnail_url = save_upload_file(file)

        if is_primary:
            db.query(AnimalPhoto).filter(
                AnimalPhoto.animal_id == animal_id,
                AnimalPhoto.is_primary == True
            ).update({"is_primary": False})

        photo = AnimalPhoto(
            animal_id=animal_id,
            url=file_url,
            thumbnail_url=thumbnail_url,
            is_primary=is_primary
        )

        db.add(photo)
        db.commit()
        db.refresh(photo)

        try:
            analysis = await analyze_animal_photo(file_url, animal_id, db)
        except:
            pass

        return {
            "id": photo.id,
            "url": photo.url,
            "thumbnail_url": photo.thumbnail_url,
            "is_primary": photo.is_primary
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if file.size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE} bytes"
        )

    try:
        file_url, _ = save_upload_file(file, subfolder="avatars")

        current_user.avatar_url = file_url
        db.commit()

        return {"avatar_url": file_url}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading avatar: {str(e)}"
        )

@router.delete("/animal/photo/{photo_id}")
def delete_animal_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    photo = db.query(AnimalPhoto).filter(AnimalPhoto.id == photo_id).first()
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )

    animal = db.query(Animal).filter(Animal.id == photo.animal_id).first()
    if animal.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this photo"
        )

    try:
        file_path = Path(photo.url.replace("/uploads/", str(UPLOAD_DIR) + "/"))
        if file_path.exists():
            os.remove(file_path)

        if photo.thumbnail_url:
            thumb_path = Path(photo.thumbnail_url.replace("/uploads/", str(UPLOAD_DIR) + "/"))
            if thumb_path.exists():
                os.remove(thumb_path)
    except:
        pass

    db.delete(photo)
    db.commit()

    return {"message": "Photo deleted successfully"}