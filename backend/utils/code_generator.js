const mongoose = require("mongoose");

// generates a random string of 6 uppercase letters and numbers
const generateCode = (length = 6) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// generate unique invitation code for groups
const generateInviteCode = async () => {
    let inviteCode;
    let existingGroup;
    
    do {
        inviteCode = generateCode(6);
        // check if the generated code already exists
        existingGroup = await mongoose.model('Group').findOne({ invite_code: inviteCode });
    } while (existingGroup); // repeat if a group with this code is found
    
    return inviteCode;
};

module.exports = {
    generateInviteCode
}