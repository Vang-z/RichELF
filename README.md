<p align="center">
  <img src="https://richelf.tech/static/media/readme.png" width="192" height="192" alt="RichELF">
</p>

<div align="center">

<img src="https://richelf.tech/static/media/readme.svg" width="180" height="64" alt="RichELF">

✨ 基于 _[FastAPI](https://github.com/tiangolo/fastapi)_ , _[Material-UI](https://github.com/mui-org/material-ui)_ 的 Python
Web 全栈项目 ✨

</div>

<p align="center">
  <a href="https://github.com/Vang-z/RichELF/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/licence-AGPL--3.0-orange" alt="license">
  </a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FVang-z%2FRichELF?ref=badge_shield">
    <img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FVang-z%2FRichELF.svg?type=shield" alt="FOSSA Status"/>
  </a>
</p>

##

### 简介

> 一款基于 [```Python```](https://www.python.org/), [```React```](https://reactjs.org/) 开发的 [```Web```](https://en.wikipedia.org/wiki/Web) 项目, 使用 [```Caddy```](https://github.com/caddyserver/caddy) 作为反向代理, 自动配置 [```TLS```](https://en.wikipedia.org/wiki/Transport_Layer_Security) 证书

##

### 实现

- [x] 用户功能
- [x] 文章功能
- [x] 评论功能
- [x] 文件功能

### 未来

#### 以下排名不分先后, 并且会更具实际情况进行增减

- [ ] 管理系统
- [ ] 视频功能
- [ ] 音乐功能
- [ ] 友链
- [ ] 浅色主题
- [ ] 实时聊天
- [ ] AI 管理

##

### 关于 ISSUE

#### 以下 ISSUE 会被直接关闭

- 提交 BUG 不使用 Template
- 询问已知问题
- 提问找不到重点
- 重复提问

##

### 声明

#### 一切开发旨在学习，请勿用于非法用途

- 本项目是完全免费且开放源代码的项目, 仅供学习使用
- 本项目不会通过任何方式强制收取费用, 或对使用者提出物质条件
- 本项目不鼓励, 不支持一切商业使用

> 请注意, 开发者并没有义务回复您的问题. 您应该具备基本的提问技巧.  
> 有关如何提问, 请阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md)

##

### 部署

本方案针对 ```Ubuntu Server 20.04 LTS x64``` 系统, 其余系统请自行参照该方案进行部署.

本方案默认您持有域名且已经通过管局备案, 具有 ```nodejs``` ```python3``` ```Ubuntu``` 基础, 且服务器已经安装并成功配置 ```python3.7.4 ↑```, ```mysql```
, ```redis```

1. 克隆本仓库到本地

- 项目结构:
    ```
    RichELF
    ├── web
    │    ├── public/
    │    ├── src/
    │    ├── package.json
    │    ├── package-lock.json
    │    └── tsconfig.json
    ├── server
    │    ├── app/
    │    ├── static/
    │    ├── config.py
    │    ├── main.py
    │    ├── requirements.txt
    │    ├── .env
    │    └── .env.dev
    ├── LICENCE
    ├── LICENCE
    └── README.md
    ```
  其中 ```web``` 文件夹对应前端文件, ```server``` 文件夹对应后端文件


2. 打包 ```React APP``` 静态文件

- 当前项目指定 ```nodejs == 14.17.0``` 请勿随意切换其他版本
- 切换目录至 ```web``` , 使用 ```npm install ``` 安装项目依赖, 以来安装完成后使用 ```npm run build``` 进行打包, 打包结束后 ```web```
  目录会生成 ``` build ``` 文件夹, 其项目结构为:
    ```
    build
    ├── static
    │    ├── css/
    │    ├── js/
    │    └── media/
    ├── tinymce
    │    ├── lang/
    │    └── tinymce.min.js
    ├── asset-manifest.json
    ├── favicon.ico
    ├── favicon.white.ico
    ├── index.html
    ├── logo192.png
    ├── logo512.png
    ├── manifest.json
    └── robots.txt
    ```


3. 修改服务端为生产模式

- 切换目录至 ```server``` , 创建 ```.env.prod``` 文件, 与 ```.env``` 文件同级
- 修改 ```.env``` 文件内容为 ```ENVIRONMENT = ".env.prod"```
- 向 ```.env.prod``` 文件添加以下内容
    ```
    # 生产环境配置文件

    # 服务配置
    HOST = "0.0.0.0"
    PORT = "8000"
    DOMAIN = ""
    STATIC_FILE_PATH = ""

    # 基础配置
    PAGE_SIZE = 6

    # 系统秘钥
    SECRET_KEY = ""
    # 加密算法
    ALGORITHM = "HS256"

    # 邮箱配置
    EMAIL_HOST = "smtp.qq.com"
    EMAIL_PORT = 25
    EMAIL_HOST_USER = ""
    EMAIL_HOST_PASSWORD = ""

    # redis配置
    REDIS_HOST = ""
    REDIS_PORT = ""
    REDIS_USER = "root"
    REDIS_PASSWORD = ""
    REDIS_DB_NAME = "0"

    # mysql数据库配置
    MYSQL_HOST =""
    MYSQL_PORT = ""
    MYSQL_USER = ""
    MYSQL_PASSWORD = ""
    MYSQL_DB_NAME = ""
    ```  

  - ```DOMAIN```: ```https://example.com``` 服务器域名
  - ```STATIC_FILE_PATH```: ```/usr/share/caddy/static/uploads``` 系统路径, 后文会提及该路径的作用
  - ```SECRET_KEY ```: ```HS256秘钥``` 在 ```Ubuntu``` 中输入 ```openssl rand -hex 32``` 获得, 注意请勿直接使用 ```.env.dev``` 中的秘钥,
    否则带来的损失自行承担
  - ```EMAIL_HOST_USER ```: 预发送系统邮件的QQ邮箱
  - ```EMAIL_HOST_PASSWORD  ```: 此处并非上文邮箱的密码, 需要进入邮箱官网 ```设置 => 账户 => POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务```
    开启 ```POP3/SMTP服务```, ```IMAP/SMTP服务```, 最后生成授权码， 将该授权码填入此处
  - ```REDIS_HOST```: 服务器 ```redis``` 主机号
  - ```REDIS_PORT```: 服务器 ```redis``` 端口号
  - ```REDIS_PASSWORD```: 服务器 ```redis``` 登陆密码
  - ```MYSQL_HOST```: 服务器 ```mysql``` 主机号
  - ```MYSQL_PORT```: 服务器 ```mysql``` 端口号
  - ```MYSQL_USER```: 服务器 ```mysql``` 用户名
  - ```MYSQL_PASSWORD```: 服务器 ```mysql``` 用户密码
  - ```MYSQL_DB_NAME```: 数据库名称, 与下文创建时数据库名称保持一致


4. 登陆服务器, 部署项目

- 登陆服务器创建数据库, 注意 ```字符集``` 设置为 ```utf8mb4```, ```排序规则``` 设置为 ```utf8mb4_0900_ai_ci```
- 上传 ```server``` 文件夹至服务器, 例如 ```/home/ubuntu``` 目录下
- 切换目录至 ```server```, 使用 ```pip install -r requirements.txt``` 安装项目依赖, 安装完成后还需执行 ```pip install uvloop==0.16.0```
  安装 ```linux``` 额外需要的依赖
- 配置反向代理服务, 此处使用 ```Caddy``` 作为代理服务器

  - 执行以下命令安装 ```Caddy```

    ```
    sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt update
    sudo apt install caddy
    ```

  - 创建上文提到的服务端静态文件夹 ```/usr/share/caddy/static/uploads```, 使用 ```Caddy``` 来处理所有的静态资源请求, 避免直接对后端服务器进行请求

  - 编辑 ```Caddy``` 配置文件

    ```
    cd /etc/caddy
    sudo vim Caddyfile
    ```
    输入以下内容, 请将 ```example.com``` 替换为您的域名
    ```
    www.example.com {
        redir https://example.com
    }

    example.com {
        encode gzip

        root * /usr/share/caddy /home/ubuntu/richelf_server/static

        reverse_proxy /api* 127.0.0.1:8000

        @notAPI {
           not {
                path /api*
           }

           file {
               try_files {path} /index.html
           }
        }

        rewrite @notAPI {http.matchers.file.relative}

        file_server

        log {
            output file /var/log/caddy/log.log
       }
    }
    ```
  - 执行 ```caddy reload``` 载入编辑好的配置文件
  - 将之前打包好的 ```React APP``` 上传至 ```/usr/share/caddy``` 目录下

- 创建后端服务

  - 执行以下命令创建项目服务
      ```
      cd /etc/systemd/system
      sudo vim yourname_server.service
      ```
    输入以下内容, 注: 此处 ```service``` 名称可自由替换, 但请勿与系统服务重复
      ```
      [Unit]
      Description=Gunicorn instance to serve RichELF SERVER
      After=network.target

      [Service]
      User=ubuntu
      Group=www-data
      WorkingDirectory=/home/ubuntu/server
      ExecStart=/home/ubuntu/.local/bin/gunicorn -w 8 -k uvicorn.workers.UvicornWorker main:app

      [Install]
      WantedBy=multi-user.target
      ```
    - ```User```: ```Ubuntu``` 用户名, 默认为 ```Ubuntu```
    - ```WorkingDirectory```: 前文提到的上传 ```server``` 文件夹的路径
    - ```ExecStart```: 执行 ```whereis gunicorn``` 查看 ```gunicorn``` 地址, 若与上文中的地址不一致, 将上文地址替换, ```8``` 为服务器核心数, 按需配置

- 启动服务

  - 执行 ```sudo systemctl start yourname_server.service``` 启动后端服务
  - 执行 ```systemctl status yourname_server.service``` 查看后端服务, 若 ```Active``` 为 ```running``` 则代表配置完成
