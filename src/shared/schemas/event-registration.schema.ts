import { Schema } from 'mongoose';

export const EventRegistration = new Schema({
    registrationId: Schema.Types.ObjectId,
    ctfEventId: Schema.Types.ObjectId,
    isAproved: Boolean,
});
