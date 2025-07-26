# TeenUp - Hệ Thống Quản Lý Lớp Học

Ứng dụng full-stack quản lý lớp học với React frontend, Node.js backend và MongoDB database.

## 🚀 Quick Start với Docker

### Yêu cầu hệ thống
- Docker Desktop
- Docker Compose

### Bước 1: Clone và cài đặt
```bash
git clone <repository-url>
cd testTeenUp
```

### Bước 2: Chạy toàn bộ hệ thống
```bash
docker-compose up -d
```

### Bước 3: Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🛠️ Development Mode

### Chạy từng service riêng lẻ

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### MongoDB
```bash
# Sử dụng MongoDB local hoặc MongoDB Atlas
# Cập nhật MONGODB_URI trong backend/config.env
```

## 📁 Cấu trúc dự án

```
testTeenUp/
├── frontend/                 # React App
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── containers/      # Container Components
│   │   └── App.js
├── backend/                  # Node.js API
│   ├── controllers/         # API Controllers
│   ├── models/             # MongoDB Models
│   ├── routes/             # API Routes
│   └── server.js
├── docker-compose.yml       # Docker Configuration
└── README.md
```

## 🔧 API Endpoints

### Parents
- `POST /api/parents` - Tạo phụ huynh
- `GET /api/parents` - Lấy danh sách phụ huynh
- `GET /api/parents/:id` - Lấy chi tiết phụ huynh
- `PUT /api/parents/:id` - Cập nhật phụ huynh
- `DELETE /api/parents/:id` - Xóa phụ huynh

### Students
- `POST /api/students` - Tạo học sinh
- `GET /api/students` - Lấy danh sách học sinh
- `GET /api/students/:id` - Lấy chi tiết học sinh
- `PUT /api/students/:id` - Cập nhật học sinh
- `DELETE /api/students/:id` - Xóa học sinh

### Classes
- `POST /api/classes` - Tạo lớp học
- `GET /api/classes` - Lấy danh sách lớp
- `GET /api/classes?day={weekday}` - Lấy lớp theo ngày
- `PUT /api/classes/:id` - Cập nhật lớp
- `DELETE /api/classes/:id` - Xóa lớp

### Class Registrations
- `POST /api/classregistrations/classes/:class_id/register` - Đăng ký học sinh
- `GET /api/classregistrations?class_id={class_id}` - Lấy danh sách đăng ký
- `DELETE /api/classregistrations/classes/:class_id/students/:student_id` - Xóa học sinh khỏi lớp

### Subscriptions
- `POST /api/subscriptions` - Tạo gói học
- `GET /api/subscriptions` - Lấy danh sách gói học
- `PATCH /api/subscriptions/:id/use` - Sử dụng buổi học
- `PUT /api/subscriptions/:id` - Cập nhật gói học
- `DELETE /api/subscriptions/:id` - Xóa gói học

## 🐳 Docker Commands

### Chạy hệ thống
```bash
# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng hệ thống
docker-compose down

# Rebuild và chạy
docker-compose up --build -d
```

### Quản lý containers
```bash
# Xem trạng thái containers
docker-compose ps

# Restart service
docker-compose restart backend

# Xem logs của service cụ thể
docker-compose logs backend
```

## 🔍 Troubleshooting

### MongoDB Connection Error
```bash
# Kiểm tra MongoDB container
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Backend API Error
```bash
# Kiểm tra backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Build Error
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## 📊 Database Schema

### Parents
- `name` (String)
- `phone` (String)
- `email` (String)

### Students
- `name` (String)
- `dob` (Date)
- `gender` (String)
- `current_grade` (String)
- `parent_id` (ObjectId ref Parent)

### Classes
- `name` (String)
- `subject` (String)
- `day_of_week` (String)
- `time_slot` (String)
- `teacher_name` (String)
- `max_students` (Number)

### ClassRegistrations
- `class_id` (ObjectId ref Class)
- `student_id` (ObjectId ref Student)

### Subscriptions
- `student_id` (ObjectId ref Student)
- `package_name` (String)
- `start_date` (Date)
- `end_date` (Date)
- `total_sessions` (Number)
- `used_sessions` (Number)

## 🚀 Deployment

### Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d
```

### Environment Variables
Tạo file `.env` cho production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://minh11992200:minh0192@testteamup.sahvubu.mongodb.net/teamUp?retryWrites=true&w=majority&appName=testTeamUp
PORT=5000
REACT_APP_API_URL=http://your-domain.com:5000
```

## 📝 License

MIT License 
