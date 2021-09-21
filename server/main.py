import uvicorn
from app import init_app
from config import configs

app = init_app()

if __name__ == '__main__':
    uvicorn.run('main:app', host=configs.HOST, port=int(configs.PORT), reload=False)
