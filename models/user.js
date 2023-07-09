const mongoose = require('mongoose').default

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    domain: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)