import { Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Iteam } from './interfaces/team.interface';
import { TeamInfoDTO } from './dto/team.dto';
import { IUser } from '../users/interfaces/user.interface';
import { Validator } from 'class-validator';
import { UsersService } from '../users/users.service';
const validator = new Validator();
@Injectable()
export class TeamsService {
    constructor(
        @InjectModel('Team') private readonly teamModel: Model<Iteam>,
        private readonly userService: UsersService
    ) { }

    async createTeam(userId: string, teamDto: TeamInfoDTO) {
        const { teamName } = teamDto;
        let user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        const team = await this.teamModel.findOne({ teamName: teamName })
        if (team) {
            throw new UnprocessableEntityException('This name already taken.');
        }
        // create team model with dto and addition info
        const createdTeam = new this.teamModel({
            ...teamDto,
            leader: userId,
            members: [userId]
        });
        let result = await createdTeam.save();
        // using this to add teamId to user who create this team... purpose: make the 2 way refference
        await this.userService.findUserAndUpdate({ _id: user._id }, { teams: [...user.teams, result._id] });
        return result;
    }

    async getTeam(id: string): Promise<Iteam> {
        const team = this.teamModel.findById(id);
        if (!team) {
            throw new NotFoundException('Team not found');
        }
        return team;
    }

    async getAllTeams() {
        const teams = await this.teamModel.find().populate('members', '-teams -password'); // -password mean exclue password
        return teams;
    }

    async destroyTeams(userId: number, ) {

    }
    async addMember(memberIdOrEmail: string, teamId: string) {
        const team = await this.teamModel.findById(teamId);
        if (!team) {
            throw new NotFoundException('Team not found.');
        }
        let newMember: IUser;
        if (validator.isEmail(memberIdOrEmail)) {
            newMember = await this.userService.findOneByEmail(memberIdOrEmail);
        }
        else newMember = await this.userService.getUserById(memberIdOrEmail);
        if (!newMember) {
            throw new NotFoundException('User add not found.');
        }

        // if (newMember.teams.includes(teamId) || team.members.indexOf(newMember._id) > -1) {
        if (newMember.teams.length > 0 || team.members.indexOf(newMember._id) > -1) { //check if user already in a team or not
            throw new UnprocessableEntityException('User already in a team.');
        }
        // console.log(typeof newMember);
        team.members.push(newMember._id);
        const updatedTeam = new this.teamModel(team);
        const result = await updatedTeam.save();
        await this.userService.findUserAndUpdate({ _id: newMember._id }, { teams: [...newMember.teams, result._id] });
        // await newMember.updateOne({ teams: [...newMember.teams, result._id] })
        return result;
    }

    async removeMember(userId: string, userToRemoveId: string, teamId: string) {
        let team = await this.teamModel.findById(teamId);
        if (!team) {
            throw new NotFoundException('Team not found.');
        }

        // console.log(typeof team.leader);
        // console.log('userid',typeof userId);
        // check suitable confition
        if (team.leader.toString() !== userId) {
            throw new UnprocessableEntityException('Only leader can removed.');
        }
        const userToRemove = await this.userService.getUserById(userToRemoveId);
        if (!userToRemove) {
            throw new NotFoundException('User to remove not found.');
        }
        // console.log(team.members.indexOf(userToRemove._id));
        if (team.members.indexOf(userToRemove._id) < 0) { //check if user already in a team or not
            throw new UnprocessableEntityException('User not in this team.');
        }

        // start to remove refference between teams and user
        let members = team.members;
        members = members.filter(member => member.toString() !== userToRemoveId);
        // await team.updateOne({ members: members });
        team = await this.findOneAndUpdate({ _id: team._id }, { members: members }, {
            new: true,
            upsert: true
        });

        let userTeams = userToRemove.teams;
        // console.log(userTeams);
        userTeams = userTeams.filter(user_team => { console.log(user_team); user_team._id.toString() !== teamId });
        // userToRemove.updateOne({ teams: userTeams})
        await this.userService.findUserAndUpdate({ _id: userToRemoveId }, { teams: userTeams })
        // team = await this.teamModel.findById(teamId);
        return team;
    }

    async registerCTFEvent(teamId: string, eventId: string): Promise<Iteam> {
        const event = await this.teamModel.findById(teamId).find({ eventsRegistration: { event: eventId } });
        if (event.length > 0) throw new UnprocessableEntityException('Event already registered');
        const team = await this.teamModel.findByIdAndUpdate(teamId, {
            $addToSet: {
                eventsRegistration: { event: eventId, grade: 0 }
            }
        }, { new: true });
        return team;
    }

    async updateGrade(teamId: string, eventId: string, grade: number) {
        const team = await this.teamModel.findOne({ _id: teamId }).exec();
        if (!team) {
            throw new NotFoundException('Team not found.');
        }

        let eventsRegistration = team.eventsRegistration;
        eventsRegistration.map(event => {
            if (event._id === event.id) {
                event.grade = grade;
                return event;
            }
        });

        team.eventsRegistration = eventsRegistration;;

        const result = team.save();
        return result;
    }

    async findOneAndUpdate(filter: object, update: object, option: object) {
        return await this.teamModel.findByIdAndUpdate(filter, update, option);
    }
}
