import express from "express"
import jwt from "jsonwebtoken"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import path  from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath=path.join(__dirname,'public');

const app = express();

dotenv.config();
app.use(bodyParser.json());

const users = [{ username: 'user1', password: 'password123' }]; // Dummy user

//app.use(express.static(__dirname + "public"));

app.get("/", (req, res, next) => {
  res.sendFile(`${publicPath}/index.html`);
    // res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});
app.get("/main", (req, res, next) => {

  res.sendFile(`${publicPath}/main.html`);

});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(403).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken({ username });
  const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });
  res.json({ accessToken, refreshToken });
});

// Token Refresh Endpoint
app.post('/api/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
});

// Authenticated Endpoint
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000, () => console.log(`Server running on http://localhost:5000`));