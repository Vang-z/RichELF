from pydantic import BaseModel, HttpUrl
from app.db.models import PydanticArticle, PydanticPreviewArticle
from typing import Optional, List


class ArticleModel(PydanticArticle):
    author: str


class PreviewArticleModel(PydanticPreviewArticle):
    author: str


class ArticleInfoModel(BaseModel):
    data: ArticleModel
    code: int


class ArticlePaginationModel(BaseModel):
    count: int
    next: Optional[HttpUrl]
    previous: Optional[HttpUrl]
    results: Optional[List[PreviewArticleModel]]
