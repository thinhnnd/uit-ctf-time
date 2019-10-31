import { Schema } from 'mongoose';

export const TeamJoinEvent = new Schema({
    teamId: Schema.Types.ObjectId,
    ctfEventId: Schema.Types.ObjectId,
    grade: Number,
    passed: Boolean
})