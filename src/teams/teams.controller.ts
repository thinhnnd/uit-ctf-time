import { Controller, Get, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { User } from '../users/user.decorator';
import { TeamInfoDTO } from './dto/team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/teams')
export class TeamsController {

    constructor(
            private readonly teamsService: TeamsService,
        ) {}

    @Get()
    async getAllTeams() {
        
    }

    @Get()
    async getTeam() {

    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTeam(@User('userId') userId, @Body() teamInfo: TeamInfoDTO) {
        return await this.teamsService.createTeam(userId, teamInfo);
    }

    @Put()
    async updateTeam() {

    }

    @Delete()
    async deleteTeam() {
        
    }
}
