import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, trim: true },
    full_name: { type: String, lowercase: true, trim: true },
    username: { type: String, lowercase: true, trim: true },
    password: String,
    team_id: Schema.Types.ObjectId,
    date_of_birth: Date,
    role: { type: String, default: 'user' },
    created_at: { type: Date, default: Date.now, immutable: false },
});