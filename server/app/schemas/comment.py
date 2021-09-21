from pydantic import BaseModel
from typing import List


class CommentModel(BaseModel):
    data: List[dict]
    code: int
