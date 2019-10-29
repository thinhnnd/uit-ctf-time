import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

    async createUser(userDto: UserDto) : Promise<IUser> {
        // const createdCat = new this.catModel(createCatDto);
        // return await createdCat.save();
        const createdUser = new this.userModel(userDto);
        return await createdUser.save();
    }

    async getAllUsers() : Promise<IUser[]> {
        return await this.userModel.find().exec();
    }

    async getUserById(userId: String) : Promise<IUser> {
        return await this.userModel.findById(userId);
    }

    async destroyUser(userId: String) {
        return await this.userModel.deleteOne({id: userId});
    }
    
}
