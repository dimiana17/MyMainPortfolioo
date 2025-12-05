const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/token.util');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashed });
  const token = createToken({ id: user._id, role: user.role });

  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken({ id: user._id, role: user.role });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
