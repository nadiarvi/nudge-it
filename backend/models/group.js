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
    chats: { type: String } // TODO: update later
})

module.exports = mongoose.model('Group', GroupSchema);