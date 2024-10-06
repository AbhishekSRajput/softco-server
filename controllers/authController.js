const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword
    },
  });
  delete newUser.password
  return res.status(201).json({ message: 'User created successfully', user: newUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password. Please try again.' });
  }

  const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.status(200).json({ token });
};

module.exports = { register, login };
