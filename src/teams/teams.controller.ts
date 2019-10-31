import { Controller, Get, Post, Put, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { User } from '../users/user.decorator';
import { TeamInfoDTO } from './dto/team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Controller('api/teams')
export class TeamsController {

    constructor(
            private readonly teamsService: TeamsService,
        ) {}

    @Get()
    async getAllTeams() {
        return await this.teamsService.getAllTeams();
    }

    @Get(':id')
    async getTeam(@Param('id') id: string) {
        return await this.teamsService.getTeam(id)
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTeam(@User('userId') userId, @Body() teamInfo: TeamInfoDTO) {
        return await this.teamsService.createTeam(userId, teamInfo);
    }

    @Put()
    async updateTeam() {

    }

    @Put(':id/add-member')
    @UseGuards(AuthGuard('jwt'))
    async addMember(@User('userId') userId, @Param('id') teamId: string ,@Body('userToAddId') userToAddId: string) {
        return await this.teamsService.addMember(userId, userToAddId, teamId);
    }

    @Put(':id/add-member')
    @UseGuards(AuthGuard('jwt'))
    async addMemberByEmail(@User('userId') userId, @Param('id') teamId: string ,@Body() userToAddEmail: string) {
        return await this.teamsService.addMemberByEmail(userId, teamId, userToAddEmail);
    }

    @Delete()
    async deleteTeam() {
        
    }
}
