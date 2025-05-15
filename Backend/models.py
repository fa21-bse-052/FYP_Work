from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional

class ChatIDOut(BaseModel):
    chat_id: str

class MessageIn(BaseModel):
    question: str
    
class ContactMessage(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name:  str = Field(..., min_length=1, max_length=50)
    email:      EmailStr
    message:    str = Field(..., min_length=1, max_length=1000)
    
# === Trainer Models ===
class InitializeBotResponse(BaseModel):
    bot_id: str

class CreateBotRequest(BaseModel):
    bot_id: str
    prompt_type: str

class CreateBotResponse(BaseModel):
    bot_id: str

class DocumentPath(BaseModel):
    bot_id: str
    data_path: str

class NewChatResponse(BaseModel):
    chat_id: str

class QueryRequest(BaseModel):
    bot_id: str
    chat_id: str
    query: str

class QueryResponse(BaseModel):
    response: str
    web_sources: List[str]

# === Authentication Models ===
class User(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str

    @validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must include at least one number.")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must include at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise ValueError("Password must include at least one lowercase letter.")
        if not any(char in "!@#$%^&*()-_+=<>?/" for char in value):
            raise ValueError("Password must include at least one special character.")
        return value

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr]
    password: Optional[str]

    @validator("password")
    def validate_password(cls, value):
        if value is not None:
            if len(value) < 8:
                raise ValueError("Password must be at least 8 characters long.")
            if not any(char.isdigit() for char in value):
                raise ValueError("Password must include at least one number.")
            if not any(char.isupper() for char in value):
                raise ValueError("Password must include at least one uppercase letter.")
            if not any(char.islower() for char in value):
                raise ValueError("Password must include at least one lowercase letter.")
            if not any(char in "!@#$%^&*()-_+=<>?/" for char in value):
                raise ValueError("Password must include at least one special character.")
        return value

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class LoginResponse(Token):
    name: str
    avatar: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None
