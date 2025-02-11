import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
dotenv.config();

// middleware/index.js
const app = express();

// Configuration
const USERS_API = 'http://localhost:3001';
const ADDRESSES_API = 'http://localhost:3002';
const TRANSACTIONS_API = 'http://localhost:3003';
const WALLET_API = 'http://localhost:3004';
const KYC_API = 'http://localhost:3005';

// Proxy middleware configuration
const usersProxy = createProxyMiddleware({
  target: USERS_API,
  changeOrigin: true,
});

const addressesProxy = createProxyMiddleware({
  target: ADDRESSES_API,
  changeOrigin: true,
});

const transactionsProxy = createProxyMiddleware({
    target: TRANSACTIONS_API,
    changeOrigin: true,
});

const walletProxy = createProxyMiddleware({
  target: WALLET_API,
  changeOrigin: true,
});

const kycProxy = createProxyMiddleware({
  target: KYC_API,
  changeOrigin: true,
});

// Routes
app.use('/api/users', usersProxy);
app.use('/api/addresses', addressesProxy);
app.use('/api/transactions', transactionsProxy);
app.use('/api/wallets', walletProxy);
app.use('/api/kycs', kycProxy);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});