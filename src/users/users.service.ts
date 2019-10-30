import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { UserDto, LoginDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

export type User = any;
@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}
    private sanitizeUser(user: User) {
        const sanitize = user.toObject();
        delete sanitize['password'];
        delete sanitize['updatedAt'];
        return sanitize;
    }
    async createUser(userDto: UserDto) : Promise<IUser> {
        const user = await this.userModel.findOne({email: userDto.email});
        if(user) {
            throw new HttpException('Email already exists!', HttpStatus.BAD_REQUEST);
        }
        const createdUser = new this.userModel(userDto);
        await createdUser.save();
        return this.sanitizeUser(createdUser);
    }

    async getAllUsers() : Promise<IUser[]> {
        const users = await this.userModel.find().exec();
        return users.map( user => this.sanitizeUser(user));
    }

    async getUserById(userId: String) : Promise<IUser> {
        try {
            const user = await this.userModel.findById(userId);
            return this.sanitizeUser(user);
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async destroyUser(userId: String) {
        return await this.userModel.deleteOne({id: userId});
    }

    async findOneByEmail(userEmail: String) {
        try {
            const user = await this.userModel.findOne({email: userEmail});
            return user;
        }
        catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByLoginInput(userLogin: LoginDto) {
        const { email, password } = userLogin;
        const user = await this.userModel.findOne({email: email});
        if(!user) {
            throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
        }
        if(!await bcrypt.compare(password, user.password)) {
            throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
        }
        return this.sanitizeUser(user);
    }
    
}
