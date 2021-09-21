from pydantic import BaseModel, HttpUrl
from typing import Any, Optional, Dict


class CommModel(BaseModel):
    data: Any
    msg: str
    code: str


class PaginationModel(BaseModel):
    count: int
    next: Optional[HttpUrl]
    previous: Optional[HttpUrl]
    results: Dict
