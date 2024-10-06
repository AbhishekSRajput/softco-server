const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ message: 'User created successfully', user: newUser });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.status(200).json({ token });
};

module.exports = { register, login };
