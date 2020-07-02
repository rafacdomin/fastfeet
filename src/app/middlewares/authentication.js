import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }

  return next();
};
