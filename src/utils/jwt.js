import jwt from 'jsonwebtoken';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-JWT-secret-key-please-change-in-production';
const JWT_EXPIRES_IN = '1d'; // Token expiration time

export const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (error) {
            logger.error('Error signing JWT token:', error);
            throw new Error('Error signing JWT token');
        }
    },
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            logger.error('Error verifying JWT token:', error);
            throw new Error('Invalid or expired JWT token');
        }                   
    }           
}