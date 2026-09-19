import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { signToken, verifyToken, decodeTokenUnverified } from './server/jwt';
import { encryptAES256, decryptAES256 } from './server/crypto';

const app = express();
const PORT = 3000;

app.use(express.json());

// Extend express Request interface with authenticated user
interface AuthRequest extends Request {
  user?: any;
}

// Authentication Middleware via JWT
function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header. Expected Bearer <JWT_TOKEN>' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired JWT token session' });
  }

  const user = db.getUserById(payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User for this token session no longer exists' });
  }

  req.user = user;
  next();
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Skill Swap Secure Core',
    security: {
      session: 'JWT HS256',
      encryptionAtRest: 'AES-256-GCM',
      storage: 'Encrypted Persistence',
    },
  });
});

// Register: representative order [Full Name, Email, Password, College Name, Year]
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, college, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const newUser = await db.registerUser({
      name,
      email,
      password,
      college: college || 'General Engineering College',
      year: year || '1st Year',
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    res.status(201).json({
      message: 'User registered and personal data encrypted at rest with AES-256-GCM',
      token,
      user: db.toSafeUser(newUser),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Login: representative order [Email or username, Password]
app.post('/api/auth/login', async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email;
    const password = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const user = await db.authenticate(identifier, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your email/username and password.' });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      message: 'Authentication successful',
      token,
      user: db.toSafeUser(user),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Current User profile (decrypted for authenticated user session)
app.get('/api/auth/me', authenticateJWT, (req: AuthRequest, res) => {
  res.json({
    user: db.toSafeUser(req.user),
  });
});

// Modify user data according to the form & encrypt at rest with AES-256
app.put('/api/auth/profile', authenticateJWT, (req: AuthRequest, res) => {
  try {
    const { name, email, college, year, bio, photo } = req.body;
    const updatedUser = db.modifyUserData(req.user.id, {
      name,
      email,
      college,
      year,
      bio,
      photo,
    });

    res.json({
      message: 'Personal profile updated and re-encrypted at rest using AES-256-GCM',
      user: db.toSafeUser(updatedUser),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

// Skills: List / Filter
app.get('/api/skills', (req, res) => {
  const { category, type, search } = req.query;
  const skills = db.getSkills({
    category: category as string,
    type: type as string,
    search: search as string,
  });
  res.json({ skills });
});

// Skill: Get by ID
app.get('/api/skills/:id', (req, res) => {
  const skill = db.getSkillById(req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json({ skill });
});

// Skill: Add new
app.post('/api/skills', authenticateJWT, (req: AuthRequest, res) => {
  try {
    const { title, category, description, type } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required' });
    }

    const newSkill = db.addSkill(req.user, {
      title,
      category,
      description,
      type: type === 'Learn' ? 'Learn' : 'Teach',
    });

    res.status(201).json({
      message: 'Skill published successfully',
      skill: newSkill,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Bookings: List for user
app.get('/api/bookings', authenticateJWT, (req: AuthRequest, res) => {
  const bookings = db.getBookingsForUser(req.user.id);
  res.json({ bookings });
});

// Bookings: Create new
app.post('/api/bookings', authenticateJWT, (req: AuthRequest, res) => {
  try {
    const { teacherId, skillId, dateTime, notes } = req.body;
    if (!teacherId || !skillId || !dateTime) {
      return res.status(400).json({ error: 'Teacher ID, skill ID, and date/time are required' });
    }

    const booking = db.createBooking({
      teacherId,
      learnerId: req.user.id,
      skillId,
      dateTime,
      notes,
    });

    res.status(201).json({
      message: 'Session booking confirmed with AES-256 encrypted notes',
      booking,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Bookings: Update status
app.patch('/api/bookings/:id/status', authenticateJWT, (req: AuthRequest, res) => {
  const { status } = req.body;
  if (!['Confirmed', 'Pending', 'Completed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid booking status' });
  }

  const success = db.updateBookingStatus(req.params.id, status);
  if (!success) return res.status(404).json({ error: 'Booking not found' });
  res.json({ message: `Booking status updated to ${status}` });
});

// Chats: Get messages with peer
app.get('/api/chats/:peerId', authenticateJWT, (req: AuthRequest, res) => {
  const messages = db.getMessagesBetween(req.user.id, req.params.peerId);
  res.json({ messages });
});

// Chats: Send message to peer (encrypted with AES-256 at rest)
app.post('/api/chats/:peerId', authenticateJWT, (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const chat = db.sendMessage(req.user, req.params.peerId, message.trim());
    res.status(201).json({
      message: 'Message delivered and stored under AES-256-GCM encryption at rest',
      chat,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Security & Database Vault Inspector: Live Cryptographic Inspection
app.get('/api/security/vault', (req, res) => {
  const vault = db.getRawDatabaseVault();
  res.json({
    vault,
    serverTime: new Date().toISOString(),
  });
});

// Security: Live Cryptographic Test Bench
app.post('/api/security/test-crypto', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required' });
  }

  const encrypted = encryptAES256(text);
  const decrypted = decryptAES256(encrypted);

  res.json({
    originalPlaintext: text,
    algorithm: 'AES-256-GCM',
    keyLengthBits: 256,
    initializationVectorHex: encrypted.iv,
    authenticationTagHex: encrypted.authTag,
    ciphertextHex: encrypted.ciphertext,
    decryptedBack: decrypted,
    verifiedRoundtrip: text === decrypted,
  });
});

// Decode JWT token unverified for inspection UI
app.post('/api/security/inspect-jwt', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  const verified = verifyToken(token);
  const decoded = decodeTokenUnverified(token);

  res.json({
    isValid: verified !== null,
    decoded,
  });
});

// --- VITE DEV / PRODUCTION STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Skill Swap Server] Running with JWT auth and AES-256 storage at http://0.0.0.0:${PORT}`);
  });
}

startServer();
