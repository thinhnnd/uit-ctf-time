import { Document } from 'mongoose';

export interface Iteam extends Document {
    readonly name: string;
    readonly teamMembers: string;
    readonly eventsRegistration: string;
    readonly teamEventStatusId: string;    
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
