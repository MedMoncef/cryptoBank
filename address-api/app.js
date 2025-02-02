import express from 'express';
import mongoose from 'mongoose';
import addressRoutes from './routes/address.routes.js';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Bank').then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/addresses', addressRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error Handler
import errorHandler from './middleware/errorHandler.js';
app.use(errorHandler);

export default app;