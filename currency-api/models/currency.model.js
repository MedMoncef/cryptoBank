import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true, unique: true },
    type: { type: String, enum: ['CRYPTO', 'FIAT'], required: true },
    exchangeRate: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

currencySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

currencySchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('Currency', currencySchema);