# === contact.py ===
# Create this new file at the project root or in your routers directory
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from pymongo.collection import Collection

from config import CONNECTION_STRING
from pymongo import MongoClient
from models import ContactMessage

# Initialize MongoDB client and collection
_client = MongoClient(CONNECTION_STRING)
_db = _client.users_database
messages_collection: Collection = _db.get_collection("messages")

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=dict,
    summary="Submit a contact message"
)
async def submit_contact(contact: ContactMessage):
    """
    Receive first_name, last_name, email, and message in the request body
    and store them in MongoDB.
    """
    doc = contact.dict()
    doc.update({"created_at": datetime.utcnow()})

    try:
        result = messages_collection.insert_one(doc)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save contact message"
        )

    return {"message": "Contact message received", "id": str(result.inserted_id)}

