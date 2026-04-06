import crypto from "node:crypto";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const demoUser = {
  id: 1,
  name: "Admin Demo",
  email: "admin@example.com",
  password: "123456"
};

const sessions = new Map();

app.use(
  cors({
    origin: frontendOrigin
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Auth API is running",
    demoAccount: {
      email: demoUser.email,
      password: demoUser.password
    }
  });
});

app.post("/api/login", (req, res) => {
  const email = req.body?.email?.trim();
  const password = req.body?.password?.trim();

  if (!email || !password) {
    return res.status(400).json({
      message: "Vui long nhap day du email va mat khau."
    });
  }

  if (email !== demoUser.email || password !== demoUser.password) {
    return res.status(401).json({
      message: "Email hoac mat khau khong dung."
    });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const user = {
    id: demoUser.id,
    name: demoUser.name,
    email: demoUser.email
  };

  sessions.set(token, user);

  return res.json({
    message: "Dang nhap thanh cong.",
    token,
    user
  });
});

app.get("/api/profile", (req, res) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.replace("Bearer ", "").trim();
  const user = sessions.get(token);

  if (!user) {
    return res.status(401).json({
      message: "Phien dang nhap khong hop le hoac da het han."
    });
  }

  return res.json({ user });
});

app.post("/api/logout", (req, res) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.replace("Bearer ", "").trim();

  if (token) {
    sessions.delete(token);
  }

  return res.json({
    message: "Da dang xuat."
  });
});

app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}`);
});
