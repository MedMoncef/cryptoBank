import express from 'express';
import mongoose from 'mongoose';
import walletRoutes from './routes/currency.routes.js';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect('mongodb://localhost:27017/Bank').then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/currencies', walletRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error Handler
import errorHandler from './middleware/errorHandler.js';
app.use(errorHandler);

export default app;