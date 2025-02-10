import mongoose from 'mongoose';

const kycStatusEnum = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
};

const kycSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: Object.values(kycStatusEnum), default: kycStatusEnum.PENDING },
    documents: [{ type: String }], // Array of document URLs/paths
    verificationDate: { type: Date },
}, { timestamps: true });

kycSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

kycSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('KYC', kycSchema);