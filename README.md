# 專案名稱 My Fitness Plan

### 這是一款幫助減肥的人所設計出的熱量控制APP。用戶可以通過電子郵件和密碼登入，或是使用 Google 帳戶進行快速登入。它根據用戶的基本資訊計算出所應攝取的熱量，並且透過第三方api的串連自動記錄這些食物的營養素成分來更新當日剩餘的卡路里攝取量。用戶也可以查看當日的飲食攝取日誌，並根據實際攝取情況進行調整。

### 技術棧

* Node.js
* express
* Passport.js 
* PostgreSQL 
* Docker
* bcryptjs
* dotenv
* cors 
* dotenv 
* express-handlebars 
* passport-google-oauth20 
* passport-local
* sequelize 
* express-session
* nodemon

### 專案結構

MY_FITNESS_PLAN/
├── controllers/             # 控制器目錄，處理業務邏輯
│   ├── food.js              # 食物相關控制器
│   ├── intake.js            # 攝取記錄相關控制器
│   ├── userAuthorize.js     # 使用者授權控制器
│   └── userRecord.js        # 使用者資料控制器
├── database/                # 資料庫相關文件
│   └── sequelize.js         # Sequelize ORM 配置
├── models/                  # 資料庫模型目錄
├── node_modules/            # Node.js 相依套件
├── public/                  # 公共資源目錄（靜態文件）
├── routes/                  # 路由定義目錄
│   ├── foodRoutes.js        # 食物相關路由
│   ├── intakeRoutes.js      # 攝取記錄相關路由
│   ├── userAuthorize.js     # 使用者授權路由
│   └── userRoutes.js        # 使用者資料相關路由
├── views/                   # 視圖模板目錄 (Handlebars)
│   ├── addRecord.hbs        # 添加記錄頁面模板
│   ├── intakelogs.hbs       # 攝取記錄頁面模板
│   ├── login.hbs            # 登入頁面模板
│   ├── profile.hbs          # 個人資料頁面模板
│   ├── register.hbs         # 註冊頁面模板
│   └── userRecords.hbs      # 使用者資料頁面模板
├── .env.dev                 # 開發環境變數配置
├── .gitignore               # Git 忽略文件
├── docker-compose.yml       # Docker Compose 配置文件
├── Dockerfile               # Docker 映像文件配置
├── index.js                 # 應用程式入口文件
└── package.json             # 專案元數據及相依套件管理
└── README.md                # 專案說明文件



### .env.example

```plaintext
# PostgreSQL 資料庫配置
local_postgresql_USER=your_db_username
# 使用 Docker 時將 HOST 切換為 db
local_postgresql_HOST=localhost
local_postgresql_PORT=5432
local_postgresql_DATABASE=your_db_name
local_postgresql_PASSWORD=your_db_password
local_sql_type=postgres

# API 配置
api_id=your_api_id
api_key=your_api_key

# Google OAuth2 配置
clientID=your_google_client_id
clientSecret=your_google_client_secret
local_callbackURL=http://localhost:3000/auth/google/callback
LOCAL_GOOGLE_LOGIN_URL=http://localhost:3000/auth/google
```
### 安裝步驟
克隆專案到本地

```bash
git clone https://github.com/wu0010802/my_fitness_plan.git
```

### project setup
```bash
npm install
```

### Compiles and hot-reloads for development
```bash
npm run dev
```


### API EndPoint
* render部署：https://my-fitness-plan-en9m.onrender.com/login






