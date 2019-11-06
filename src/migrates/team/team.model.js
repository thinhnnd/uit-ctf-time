const mongoose = require('mongoose');
const TeamSchema = new mongoose.Schema({
    teamName: String,
    leader: Schema.Types.ObjectId,
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    eventsRegistration: [{ type: Schema.Types.ObjectId, ref: 'Event_Registration' }],
    teamEventStatusId: [{ type: Schema.Types.ObjectId, ref: 'TeamEventStatus' }],
}, { timestamps: true });
module.exports = TeamModel = mongoose.model('Team', TeamSchema);