from pydantic import BaseModel, HttpUrl
from app.db.models import PydanticUser
from typing import Optional, List


class TokenModel(BaseModel):
    access_token: str
    token_type: str


class UserModel(PydanticUser):
    followings: int
    followers: int


class UserPaginationModel(BaseModel):
    count: int
    next: Optional[HttpUrl]
    previous: Optional[HttpUrl]
    results: Optional[List[UserModel]]
