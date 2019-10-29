import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

export const CTFEventSchema = new mongoose.Schema({
    "id": SchemaTypes.ObjectId,
    "organizers": Array,
    "onsite": Boolean,
    "finish": Date,
    "description": String,
    "weight": Number,
    "title": String,
    "url": String,
    "is_votable_now": Boolean,
    "restrictions": String,
    "format": String,
    "start": Date,
    "participants": Number,
    "ctftime_url": String,
    "location": String,
    "live_feed": String,
    "public_votable": Boolean,
    "duration": {
        "hours": Number,
        "days": Number
    },
    "logo": String,
    "format_id": Number,
    "ctf_id": Number,
});