import { Controller, Get, Post, Put, Delete, Body, UseGuards, Param, Req, Res, BadRequestException, Query, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../users/user.decorator';
import { TeamInfoDTO } from './dto/team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from '@nestjs/passport';
import { Iteam } from './interfaces/team.interface';

@Controller('api/v1/teams')
export class TeamsController {

    constructor(
        private readonly teamsService: TeamsService,
    ) { }

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

    @Put(':id/update-grade')
    @UseGuards(AuthGuard('jwt'))
    async updateGrade(@User('userId') userId: string, @Param('id') teamId: string, @Body() body: any){
        const { eventId, grade } = body;
        return await this.teamsService.updateGrade(teamId, eventId, grade);
    }

    @Put(':id/remove-member')
    @UseGuards(AuthGuard('jwt'))
    async removeMember(@User('userId') userId, @Param('id') teamId: string, @Body('userToRemoveId') userToRemoveId: string) {
        return await this.teamsService.removeMember(userId, userToRemoveId, teamId);
    }


    @Put(':id/add-member')
    @UseGuards(AuthGuard('jwt'))
    async addMember(@Req() req: Request, @Body() body: any) {
        const teamId = req.params.id;
        if (!body) throw new BadRequestException("Body not provided");
        try {
            const { member } = body;
            if (!member) throw new BadRequestException("Invalid body");
            return await this.teamsService.addMember(member, teamId);
        } catch (error) {
            console.log(error);
            console.log(error);
            if(error.name){
                throw new InternalServerErrorException(error.message);
            }
            throw error;
        }
    }

    
    @Delete()
    async deleteTeam() {

    }

}
