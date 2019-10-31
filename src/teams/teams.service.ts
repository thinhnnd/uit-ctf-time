import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamSchema } from './schemas/team.schema';
import { Iteam } from './interfaces/team.interface';
import { TeamInfoDTO } from './dto/team.dto';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class TeamsService {
    constructor(
            @InjectModel('Team') private readonly teamModel: Model<Iteam>,
            @InjectModel('User') private readonly userModel: Model<IUser>,
        ) { }

    async createTeam(userId: string, teamDto: TeamInfoDTO) {
        const { teamName } = teamDto;
        const team = await this.teamModel.findOne({teamName: teamName})
        if(team) {
            throw new HttpException('This name already taken.', HttpStatus.BAD_REQUEST);
        }

        const createdTeam = new this.teamModel({ 
            ...teamDto, 
            leader: userId, 
            members: [userId] 
        });

        return createdTeam.save();
    }

    async getTeam(id: string): Promise<Iteam> {

        const team = this.teamModel.findById(id);

        if(!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }

        return team;
    }

    async addMember(userId: string, userNeedToAddId: string , teamId: string ) {
        const team = await this.teamModel.findById(teamId);
        if(!team) {
            throw new HttpException('Team not found.', HttpStatus.BAD_REQUEST);
        }
        const userToAdd = await this.userModel.findById(userNeedToAddId);
        if (!userToAdd) {
            throw new HttpException('User add not found.', HttpStatus.BAD_REQUEST);
        }
        if (userToAdd.team_id) {
            throw new HttpException('User already in a team.', HttpStatus.BAD_REQUEST);
        }

        if( team.members.indexOf(userToAdd.id) > -1) {
            throw new HttpException('User already in a team.', HttpStatus.BAD_REQUEST);
        }

        team.members.push(userNeedToAddId);
        const updatedTeam = new this.teamModel(team);
        return updatedTeam.save();

    }

    async addMemberByEmail(userId: string, userNeedToAddEmail: string , teamId: string ) {
        const team = await this.teamModel.findById(teamId);
        if(!team) {
            throw new HttpException('Team not found.', HttpStatus.BAD_REQUEST);
        }
        // if(team.leader !== userId) {
        //     throw new HttpException('Only leader can add member', HttpStatus.UNAUTHORIZED);
        // }
        const userToAdd = await this.userModel.findOne({email: userNeedToAddEmail});
        if (!userToAdd) {
            throw new HttpException('User add not found.', HttpStatus.BAD_REQUEST);
        }

        if (userToAdd.team_id) {
            throw new HttpException('User already in a team.', HttpStatus.BAD_REQUEST);
        }

        if( team.members.indexOf(userToAdd.id) > -1) {
            throw new HttpException('User already in a team.', HttpStatus.BAD_REQUEST);
        }

        team.members.push(userToAdd._id);
        const updatedTeam = new this.teamModel(team);
        return updatedTeam.save();

    }

    async getAllTeams() {
        const teams = await this.teamModel.find().populate('members', '-password'); // -password mean exclue password
        return teams;
    }
}
