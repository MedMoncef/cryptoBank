import mongoose from 'mongoose';

const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
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