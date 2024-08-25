# My Fitness Plan

這是一款幫助減肥的人所設計出的熱量控制APP。用戶可以通過電子郵件和密碼登入，或是使用 Google 帳戶進行快速登入。它根據用戶的基本資訊計算出所應攝取的熱量，並且透過第三方api的串連自動記錄這些食物的營養素成分來更新當日剩餘的卡路里攝取量。用戶也可以查看當日的飲食攝取日誌，並根據實際攝取情況進行調整。

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
```bash
MY_FITNESS_PLAN/
├── controllers/             
│   ├── food.js              
│   ├── intake.js            
│   ├── userAuthorize.js     
│   └── userRecord.js     
├── database/                
│   └── sequelize.js         
├── models/                
├── node_modules/           
├── public/                  
├── routes/                  
│   ├── foodRoutes.js        
│   ├── intakeRoutes.js     
│   ├── userAuthorize.js    
│   └── userRoutes.js       
├── views/                  
│   ├── addRecord.hbs      
│   ├── intakelogs.hbs       
│   ├── login.hbs            
│   ├── profile.hbs          
│   ├── register.hbs         
│   └── userRecords.hbs      
├── .env.dev                 
├── .gitignore               
├── docker-compose.yml      
├── Dockerfile             
├── index.js               
└── package.json         
└── README.md             
```


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

1.clone專案到本地

```bash
git clone https://github.com/wu0010802/my_fitness_plan.git
```

### project setup
```bash
npm install
```

### 環境變數示範
```bash
cp .env.example .env
```

### Compiles and hot-reloads for development
```bash
npm run dev
```


### 使用 Docker Compose 啟動專案

1.clone專案

```bash
git clone https://github.com/wu0010802/my_fitness_plan.git
cd my_fitness_plan
```

2.設置環境變數

```bash
cp .env.example .env
```

3.啟用docker compose

```bash
docker-compose up -d
```

### API EndPoint
* render部署：https://my-fitness-plan-en9m.onrender.com/login



