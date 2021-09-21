from pydantic import BaseModel, HttpUrl
from app.db.models import PydanticTimeline
from typing import Optional, List


class TimelinePaginationModel(BaseModel):
    count: int
    next: Optional[HttpUrl]
    previous: Optional[HttpUrl]
    results: Optional[List[PydanticTimeline]]
