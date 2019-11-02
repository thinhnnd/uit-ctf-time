import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';


export const TeamSchema = new mongoose.Schema({
    teamName: String,
    leader: Schema.Types.ObjectId,
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    eventsRegistration: [{ 
        event: {type: Schema.Types.ObjectId, ref: 'EventRegistration'}, 
        grade: { type: Number, default: 0}},
        {timestamps: true}
    ],
    teamEventStatusId: [{ type: Schema.Types.ObjectId, ref: 'TeamEventStatus' }],
}, { timestamps: true });