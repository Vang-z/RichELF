from fastapi import APIRouter, status, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from app.db.models import File as DBFile, User, Timeline, Article
from app.db import redis_session
from app.utils import comm, auth
from app.schemas import CommModel
from config import configs

router = APIRouter()


@router.post('/file/upload', summary='文件上传', response_model=CommModel)
async def file_upload(file: UploadFile = File(...), filesize: str = Form(...), category: str = Form(...),
                      identifier: str = Form(...), uid: str = Depends(auth.validate_access_token)):
    if category not in ['images', 'users', 'packages']:
        raise HTTPException(detail={'msg': '请求参数错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    db_file = await DBFile.filter(fid=f'{category}_{identifier}', absolute_pos=f'static/uploads/{category}/').first()
    if db_file:
        uri = f'{configs.DOMAIN}/{db_file.absolute_pos}{db_file.fid}.{db_file.filename.split(".")[-1]}'
        return JSONResponse(
            content={'data': uri, 'msg': '上传成功.', 'code': comm.BUSINESS.FILE_ALREADY_EXIST},
            status_code=status.HTTP_200_OK)
    with open(f'{configs.STATIC_FILE_PATH}/{category}/{category}_{identifier}.{file.filename.split(".")[-1]}',
              "wb") as f:
        f.write(await file.read())
    db_file = await DBFile.create(fid=f'{category}_{identifier}', filename=file.filename, filesize=filesize,
                                  absolute_pos=f'static/uploads/{category}/')
    await (await User.get(uid=uid)).files.add(db_file)
    uri = f'{configs.DOMAIN}/{db_file.absolute_pos}{db_file.fid}.{db_file.filename.split(".")[-1]}'
    return JSONResponse(content={'data': uri, 'msg': '上传成功.', 'code': comm.BUSINESS.OK},
                        status_code=status.HTTP_201_CREATED)


@router.get('/file/{identifier}/{aid}/{token}', summary='文件下载')
async def file_download(identifier: str, aid: str, token: str):
    uid = auth.decode_access_token(auth.base64decode(token))
    if not uid:
        raise HTTPException(detail={'msg': '用户校验失败.', 'code': comm.BUSINESS.FILE_NOT_EXIST},
                            status_code=status.HTTP_401_UNAUTHORIZED)
    db_file = await DBFile.filter(fid=identifier).first()
    article = await Article.filter(aid=aid).first()
    if db_file and article:
        db_file.download_count += 1
        await db_file.save()
        article.download_count += 1
        await article.save()
        if not redis_session.get(f'download_dataset_{aid}_{uid}'):
            await Timeline.create(creator_id=uid, action=5, file_id=identifier, article_id=article.aid)
            redis_session.setex(name=f'download_dataset_{aid}_{uid}', time=60 * 60 * 24, value=1)
        return FileResponse(
            f'{configs.STATIC_FILE_PATH.split("static")[0]}{db_file.absolute_pos}{db_file.fid}.{db_file.filename.split(".")[-1]}',
            media_type='application/octet-stream', filename=db_file.filename)
    raise HTTPException(detail={'msg': '文件不存在.', 'code': comm.BUSINESS.FILE_NOT_EXIST},
                        status_code=status.HTTP_404_NOT_FOUND)
