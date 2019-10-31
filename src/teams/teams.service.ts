import { Injectable, HttpException, HttpStatus, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamSchema } from './schemas/team.schema';
import { Iteam } from './interfaces/team.interface';
import { TeamInfoDTO } from './dto/team.dto';
import { IUser } from '../users/interfaces/user.interface';
import { Validator } from 'class-validator';
const validator = new Validator();
@Injectable()
export class TeamsService {
    constructor(
        @InjectModel('Team') private readonly teamModel: Model<Iteam>,
        @InjectModel('User') private readonly userModel: Model<IUser>,
    ) { }

    async createTeam(userId: string, teamDto: TeamInfoDTO) {
        const { teamName } = teamDto;
        const team = await this.teamModel.findOne({ teamName: teamName })
        if (team) {
            throw new UnprocessableEntityException('This name already taken.')
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

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        return team;
    }

    async addMember(memberIdOrEmail: string, teamId: string) {
        const team = await this.teamModel.findById(teamId);
        if (!team) {
            throw new NotFoundException('Team not found.');
        }
        let newMember: IUser;
        if (validator.isEmail(memberIdOrEmail)) {
            newMember = await this.userModel.findOne({ email: memberIdOrEmail })
        }
        else newMember = await this.userModel.findById(memberIdOrEmail);
        if (!newMember) {
            throw new NotFoundException('User add not found.');
        }
        if (newMember.team_id || team.members.indexOf(newMember.id) > -1) {
            throw new UnprocessableEntityException('User already in a team.');
        }
        team.members.push(newMember._id);
        const updatedTeam = new this.teamModel(team);
        return updatedTeam.save();
    }
    async getAllTeams() {
        const teams = await this.teamModel.find().populate('members', '-password'); // -password mean exclue password
        return teams;
    }
}
