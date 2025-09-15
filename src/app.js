import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.get('/', (req, res) => {
  logger.info('Hello from acquisitions!');
  res.status(200).send('Hello from acquisitions');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisition api is running', timestamp: new Date().toISOString(), uptime: process.uptime() });
});
// Import and use your routes here
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes); // Ensure authRoutes is imported correctly

export default app;
