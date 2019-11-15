import { Controller, Post, Put, Get, Delete, Body, Query, Param, UsePipes, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decorator';
import { QueryDto } from './dto/query.dto';

@Controller('api/v1/users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() data: UserDto) {
        return await this.userService.createUser(data);
    }

    @Get(':id')
    @UsePipes(new ValidationPipe())
    async read(@Param('id') userId: string){
        return await this.userService.getUserById(userId);
    }

    @Get('')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe())
    async get(@Query('filter') filter: string){
        try {
            if (!filter) {
                return await this.userService.getAllUsers();
            }
            else if(filter == "no-team") {
                return await this.userService.getUsersHaveNoTeam();
            }
        }
        catch(err) {
            throw new Error(err.message);
        }

    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Query('id') userId: string) {
        return `Update id: ${userId}`;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async destroy(@Query('id') userId: string) {
        await this.userService.destroyUser(userId);
    }
}
