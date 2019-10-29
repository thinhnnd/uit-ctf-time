import { Controller, Post, Put, Get, Delete, Body, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('api/users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Post()
    async create(@Body() data: UserDto) {
        return await this.userService.createUser(data);
    }

    @Get(':id')
    async read(@Param('id') userId: string){
        return await this.userService.getUserById(userId);
    }

    @Get()
    async readAll(){
        return await this.userService.getAllUsers();
    }

    @Put(':id')
    update(@Query('id') userId: string) {
        return `Update id: ${userId}`;
    }

    @Delete(':id')
    async destroy(@Query('id') userId: string) {
        await this.userService.destroyUser(userId);
    }
}
