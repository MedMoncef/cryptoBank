import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    userId: { type: String, required: true, default: null },
});

export default mongoose.model('Address', addressSchema);