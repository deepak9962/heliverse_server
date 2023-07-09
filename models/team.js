const mongoose = require('mongoose').default

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    users: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Team', teamSchema)