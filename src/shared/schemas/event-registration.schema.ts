import { Schema } from 'mongoose';

export const EventRegistration = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'CTF_Event' },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    isAproved: { type: Boolean, default: true },
});
