import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';


export const TeamSchema = new mongoose.Schema({
    teamName: String,
    leader: Schema.Types.ObjectId,
    teamMembers: [Schema.Types.ObjectId],
    eventsRegistration: [Schema.Types.ObjectId],
    teamEventStatusId: [Schema.Types.ObjectId]
}, {timestamps: true}) ;