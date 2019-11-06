const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    full_name: String,
    password: String,
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    date_of_birth: Date,
    role: { type: String, default: 'user' },
    // created_at: { type: Date, default: Date.now, immutable: false },
}, { timestamps: true });

module.exports = UserModel = mongoose.model('User', UserSchema);