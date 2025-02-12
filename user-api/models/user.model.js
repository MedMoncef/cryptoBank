import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const statusEnum = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
};

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String },
    motDePasse: { type: String, required: true },
    statut: { type: String, enum: Object.values(statusEnum), default: statusEnum.ACTIVE },
    statutVerificationEmail: { type: Boolean, default: false },
    statutVerificationTelephone: { type: Boolean, default: false },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

userSchema.pre('save', async function(next) {
    if (this.isModified('motDePasse')) {
        this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.motDePasse);
};

export default mongoose.model('User', userSchema);