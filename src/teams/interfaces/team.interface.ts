import { Document } from 'mongoose';

export interface Iteam extends Document {
    readonly name: string;
    readonly leader: string;
    readonly members: string[];
    eventsRegistration: IEventRegistration[];
    readonly teamEventStatusId: string[];    
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

interface IEventRegistration extends Document {
    _id: string;
    grade: number;
    event: string;
}