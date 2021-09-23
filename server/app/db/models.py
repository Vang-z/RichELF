from tortoise import fields
from tortoise.models import Model
from tortoise.contrib.pydantic import pydantic_model_creator
from uuid import uuid4
from config import configs


class User(Model):
    uid = fields.UUIDField(pk=True, description='UID, 用户标识')
    email = fields.CharField(max_length=255, null=False, unique=True, index=True, description='邮箱')
    password = fields.CharField(max_length=255, null=False, description='密码')
    username = fields.CharField(max_length=255, null=False, unique=True, index=True, description='昵称')
    avatar = fields.CharField(max_length=255, null=False, description='头像')
    bio = fields.CharField(max_length=255, null=True, description='简介')
    link = fields.CharField(max_length=255, null=True, description='主页地址')
    mobile = fields.CharField(max_length=255, unique=True, null=True, description='手机')
    create_at = fields.DatetimeField(auto_now_add=True, null=False, description='加入时间')
    is_active = fields.BooleanField(default=True, null=False, description='是否封禁')
    is_staff = fields.BooleanField(default=False, null=False, description='管理员')
    is_superuser = fields.BooleanField(default=False, null=False, description='超级管理员')
    followings: fields.ManyToManyRelation["User"] = fields.ManyToManyField('models.User', related_name='followers',
                                                                           through='user_follow_table')
    files: fields.ManyToManyRelation["File"] = fields.ManyToManyField('models.File', related_name='files',
                                                                      through='user_file_table')
    followers: fields.ManyToManyRelation["User"]
    articles: fields.ReverseRelation["Article"]
    comments: fields.ReverseRelation["Comment"]
    timelines: fields.ReverseRelation["Timeline"]
    timelines_obj: fields.ReverseRelation["Timeline"]

    def __str__(self):
        return self.username if self.username else "User"

    class Meta:
        table = 'user'
        table_description = '用户表'
        ordering = ['create_at']

    def avatar_url(self) -> str:
        return f'{configs.DOMAIN}/{self.avatar}'

    def mobile_hash(self) -> str:
        if self.mobile:
            return f'{self.mobile[:3]} * * * * {self.mobile[-4:]}'
        return ''

    class PydanticMeta:
        computed = ("avatar_url", "mobile_hash")
        exclude = ('password', 'is_active', 'is_verified', 'avatar', 'mobile')
        allow_cycles = True
        max_recursion = 4


class Article(Model):
    aid = fields.UUIDField(pk=True, description='AID, 文章标识')
    title = fields.CharField(max_length=255, null=True, description='标题')
    desc = fields.TextField(null=True, description='简介')
    lang = fields.CharField(max_length=255, null=True, description='语言')
    content = fields.TextField(null=True, description='正文')
    create_at = fields.DatetimeField(auto_now_add=True, null=False, description='创建时间')
    publish_at = fields.DatetimeField(null=True, description='发布时间')
    updated_at = fields.DatetimeField(auto_now=True, null=False, description='最后修改时间')
    # 0: 未发布 1: 审核中 2: 待修改 3: 已发布 4: 已删除
    status = fields.SmallIntField(null=False, default=0, description='状态')
    review = fields.TextField(null=True, description='审核结果')
    is_active = fields.BooleanField(default=False, null=False, description='是否使用')
    stars = fields.BigIntField(default=0, description='点赞量')
    views = fields.BigIntField(default=0, description='浏览量')
    # todo: 后期等 tortoise-orm 成熟过后再来优化这个地方, 目前添加了冗余数据, 不符合范式要求
    comment_count = fields.BigIntField(default=0, description='评论量')
    download_count = fields.BigIntField(default=0, description='下载量')
    author: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField('models.User', related_name='articles',
                                                                       description='作者')
    file: fields.ForeignKeyRelation["File"] = fields.ForeignKeyField('models.File', null=True, related_name='articles',
                                                                     description='文件')
    comments: fields.ReverseRelation["Comment"]
    timelines: fields.ReverseRelation["Timeline"]

    def __str__(self):
        return self.title if self.title else "Article"

    class Meta:
        table = 'article'
        table_description = '文章表'
        ordering = ['-create_at']

    class PydanticMeta:
        exclude = ('review', 'is_active')
        allow_cycles = True
        max_recursion = 4


class Comment(Model):
    cid = fields.UUIDField(pk=True, default=uuid4, description='CID, 评论标识')
    create_at = fields.DatetimeField(auto_now_add=True, null=False, description='创建时间')
    content = fields.TextField(null=False, description='评论内容')
    # 0: 审核中 1: 已发布 2: 已删除
    status = fields.SmallIntField(null=False, default=0, description='状态')
    author: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField('models.User', related_name='comments',
                                                                       description='评论人')
    article: fields.ForeignKeyRelation["Article"] = fields.ForeignKeyField('models.Article', null=True,
                                                                           related_name='comments', description='关联文章')
    comment: fields.ForeignKeyRelation["Comment"] = fields.ForeignKeyField('models.Comment', null=True,
                                                                           related_name='comments', description='关联评论')
    comments: fields.ReverseRelation["Comment"]

    def __str__(self):
        return str(self.cid) if self.cid else "Comment"

    class Meta:
        table = 'comment'
        table_description = '评论表'
        ordering = ['-create_at']

    class PydanticMeta:
        exclude = ('status',)
        allow_cycles = True
        max_recursion = 4


class Timeline(Model):
    tid = fields.UUIDField(pk=True, default=uuid4, description='TID, 时间线标识')
    create_at = fields.DatetimeField(auto_now_add=True, null=False, description='生成时间')
    # 0: 加入社区 1: 浏览 2: 关注 3: 取关 4: 点赞 5: 下载 6: 评论 7: 发布 8: 修改 9: 删除
    action = fields.SmallIntField(null=False, description='操作详情')
    creator: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField('models.User', null=False,
                                                                        related_name='timelines', description='创建者')
    user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField('models.User', null=True,
                                                                     related_name='timelines_obj', description='关联用户')
    article: fields.ForeignKeyRelation["Article"] = fields.ForeignKeyField('models.Article', null=True,
                                                                           related_name='timelines', description='关联文章')
    file: fields.ForeignKeyRelation["File"] = fields.ForeignKeyField('models.File', null=True,
                                                                     related_name='timelines', description='关联文件')

    def __str__(self):
        return str(self.tid) if self.tid else "Timeline"

    class Meta:
        table = 'timeline'
        table_description = '时间线表'
        ordering = ['-create_at']

    class PydanticMeta:
        allow_cycles = True
        max_recursion = 4


class File(Model):
    fid = fields.CharField(pk=True, max_length=255, description='文件MD5, FID')
    filename = fields.CharField(max_length=255, null=False, description='文件名')
    filesize = fields.CharField(default='0', max_length=255, null=False, description='文件大小, 单位字节B')
    create_at = fields.DatetimeField(auto_now_add=True, null=False, description='首次上传时间')
    absolute_pos = fields.CharField(max_length=255, null=False, description='文件于服务器根目录绝对位置')
    download_count = fields.BigIntField(default=0, description='下载量')
    users: fields.ManyToManyRelation["User"]
    articles: fields.ManyToManyRelation["Article"]
    timelines: fields.ReverseRelation["Timeline"]

    def __str__(self):
        return str(self.filename) if self.filename else "File"

    class Meta:
        table = 'file'
        table_description = '文件表'
        ordering = ['-create_at']

    class PydanticMeta:
        exclude = ('create_at',)
        allow_cycles = True
        max_recursion = 4


class Keyword(Model):
    kid = fields.UUIDField(pk=True, description='KID, 关键字标识')
    create_at = fields.DatetimeField(auto_now_add=True, null=False, description='生成时间')
    content = fields.TextField(description='内容')
    hot = fields.BigIntField(default=0, description='热度')

    def __str__(self):
        return str(self.kid) if self.kid else "Keyword"

    class Meta:
        table = 'keyword'
        table_description = '关键字表'
        ordering = ['-hot', '-create_at']

    class PydanticMeta:
        exclude = ('create_at',)
        allow_cycles = True
        max_recursion = 4


PydanticUser = pydantic_model_creator(User)
PydanticArticle = pydantic_model_creator(Article)
PydanticPreviewArticle = pydantic_model_creator(Article, name='PA', exclude=('content', 'file'))
PydanticComment = pydantic_model_creator(Comment)
PydanticTimeline = pydantic_model_creator(Timeline)
PydanticFile = pydantic_model_creator(File)
PydanticKeyword = pydantic_model_creator(Keyword)
