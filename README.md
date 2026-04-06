# CCMTPTPM

Vi du chuc nang dang nhap su dung React o frontend va Node.js o backend.

## Cau truc

- `frontend/`: giao dien React su dung Vite
- `backend/`: API Node.js su dung Express

## Tai khoan demo

- Email: `admin@example.com`
- Mat khau: `123456`

## Cach chay

### 1. Cai dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Chay backend

```bash
cd backend
npm run dev
```

Backend se chay tai `http://localhost:5000`.

### 3. Chay frontend

```bash
cd frontend
npm run dev
```

Frontend mac dinh chay tai `http://localhost:5173`.

## API

### `POST /api/login`

Gui body JSON:

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

Neu thanh cong, API tra ve `token` va thong tin `user`.
