import mongoose from 'mongoose';

const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER'
};

const transactionSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required']
  },
  receiver: {
    type: String,
    required: [true, 'Receiver is required']
  },
  amount: {
    type: mongoose.Decimal128,
    required: [true, 'Amount is required']
  },
  walletId: {
    type: String,
    required: [true, 'Wallet ID is required']
  },
  type: {
    type: String,
    enum: {
      values: Object.values(TransactionType),
      message: '{VALUE} is not a valid transaction type'
    },
    required: [true, 'Transaction type is required']
  },
  status: {
    type: String,
    enum: {
      values: Object.values(TransactionStatus),
      message: '{VALUE} is not a valid status'
    },
    default: TransactionStatus.PENDING
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Transaction', transactionSchema);