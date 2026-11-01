from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str  # the ID token from Google's frontend SDK

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
