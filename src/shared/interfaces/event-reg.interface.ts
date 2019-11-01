import { Document } from 'mongoose';
export interface IEventRegistration extends Document {
    teamId: string;
    eventId: string;
}
