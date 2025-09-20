from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, animals, shelters, donations, swipes, faqs, upload

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(animals.router, prefix="/animals", tags=["animals"])
api_router.include_router(shelters.router, prefix="/shelters", tags=["shelters"])
api_router.include_router(donations.router, prefix="/donations", tags=["donations"])
api_router.include_router(swipes.router, prefix="/swipes", tags=["swipes"])
api_router.include_router(faqs.router, prefix="/faqs", tags=["faqs"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])