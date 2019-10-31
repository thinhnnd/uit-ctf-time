import { Document } from 'mongoose';

export interface IUser extends Document {
    readonly email: string;
    readonly full_name: string;
    readonly password: string;
    readonly date_of_birth: Date;   
    readonly teams: [string];
    readonly role: string;   
    readonly created_at: Date;
}