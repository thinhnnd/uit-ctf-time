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
        let user = await this.userModel.findById(userId);  
        if(!user) {
            throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
        }
        const team = await this.teamModel.findOne({teamName: teamName})
        if(team) {
            throw new HttpException('This name already taken.', HttpStatus.BAD_REQUEST);
        }
        // create team model with dto and addition info
        const createdTeam = new this.teamModel({ 
            ...teamDto, 
            leader: userId, 
            members: [userId] 
        });

        let result = await createdTeam.save();

        // using this to add teamId to user who create this team... purpose: make the 2 way refference
        if(!user.teams) {
            await user.updateOne({ teams: [result._id] });
        }
        else {
            let teams = user.teams;
            teams.push(result._id)
            await user.updateOne({ teams: teams });
        }
        
        return result;
    }

    async getTeam(id: string): Promise<Iteam> {
        const team = this.teamModel.findById(id);

        if(!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND)
        }
        return team;
    }

    async getAllTeams() {
        const teams = await this.teamModel.find().populate('members', '-teams -password'); // -password mean exclue password
        return teams;
    }

    async destroyTeams(userId: number, ) {

    }

    async addMember(userId: string, userNeedToAddId: string , teamId: string ) {
        const team = await this.teamModel.findById(teamId);
        if(!team) {
            throw new HttpException('Team not found.', HttpStatus.BAD_REQUEST);
        }
        const userToAdd = await this.userModel.findById(userNeedToAddId);
        if (!userToAdd) {
            throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
        }
        console.log(userToAdd.teams);
        if (userToAdd.teams.length > 0) {
            throw new HttpException('User already in a team.', HttpStatus.BAD_REQUEST);
        }

        if( team.members.indexOf(userToAdd.id) > -1) {
            throw new HttpException('User already in this team.', HttpStatus.BAD_REQUEST);
        }

        team.members.push(userNeedToAddId);
        const updatedTeam = new this.teamModel(team);
        userToAdd.updateOne({ teams: userToAdd.teams.push(updatedTeam._id)});

        const result = await updatedTeam.save();

        // using this to add teamId to user who create this team... purpose: make the 2 way refference
        if(!userToAdd.teams) {
            await userToAdd.updateOne({ teams: [result._id] });
        }
        else {
            let teams = userToAdd.teams;
            teams.push(result._id)
            await userToAdd.updateOne({ teams: teams });
        }
        
        return result;

    }

    async addMemberByEmail(userId: string, userNeedToAddEmail: string , teamId: string ) {
        const team = await this.teamModel.findById(teamId);
        if(!team) {
            throw new HttpException('Team not found.', HttpStatus.BAD_REQUEST);
        }
        // if(team.leader !== userId) {
        //     throw new HttpException('Only leader can add member', HttpStatus.UNAUTHORIZED);
        // }
        console.log()
        const userToAdd = await this.userModel.findOne({email: userNeedToAddEmail});
        if (!userToAdd) {
            throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
        }

        // if (userToAdd.teams) {
        //     throw new HttpException('User already in a team.', HttpStatus.BAD_REQUEST);
        // }

        if( team.members.indexOf(userToAdd.id) > -1) {
            throw new HttpException('User already in this team.', HttpStatus.BAD_REQUEST);
        }

        team.members.push(userToAdd._id);
        const updatedTeam = new this.teamModel(team);
        userToAdd.updateOne({ teams: userToAdd.teams.push(updatedTeam._id)})

        const result = await updatedTeam.save();

        // using this to add teamId to user who create this team... purpose: make the 2 way refference
        if(!userToAdd.teams) {
            await userToAdd.updateOne({ teams: [result._id] });
        }
        else {
            let teams = userToAdd.teams;
            teams.push(result._id)
            await userToAdd.updateOne({ teams: teams });
        }
        
        return result;
    }


    async removeMember(userId: string, userToRemoveId: string , teamId: string ) {
        const team = await this.teamModel.findById(teamId);
        if(!team) {
            throw new HttpException('Team not found.', HttpStatus.BAD_REQUEST);
        }

        if(team.leader !== userId) {
            throw new HttpException('Only leader can removed.', HttpStatus.BAD_REQUEST);
        }
        
        let members = team.members;
        members.filter( member => member !== userToRemoveId);

        await team.updateOne({members: members});

        return { success: true};
    }


}
