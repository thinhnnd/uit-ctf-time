import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    full_name: String,
    password: String,
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    date_of_birth: Date,
    role: { type: String, default: 'user' },
    // created_at: { type: Date, default: Date.now, immutable: false },
}, { timestamps: true });

const roles = ['user', 'admin'];

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        if (!roles.includes(this['role'])) {
            this['role'] = 'user';
        }
        const hashed = await bcrypt.hash(this['password'], 8)
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
})