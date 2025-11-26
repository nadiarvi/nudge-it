const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // array of group id
    expo_push_tokens: [{ type: String }]
});

module.exports = mongoose.model('User', UserSchema);