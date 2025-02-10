import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    balance: { type: Number, default: 0 },
    currency: { type: String, required: true, default: 'USD' },
}, { timestamps: true });

walletSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

walletSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('Wallet', walletSchema);