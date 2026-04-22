const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, // Made optional for OAuth users
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
