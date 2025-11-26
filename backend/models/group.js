const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // array of user id
    ta_email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],     // array of task id
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    nudge_limit: { type: Number, default: 1 },
    invite_code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minLength: 6,
        maxLength: 6,
        unique: true,
        index: true
    }
})

module.exports = mongoose.model('Group', GroupSchema);