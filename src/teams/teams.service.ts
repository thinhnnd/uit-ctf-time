import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamSchema } from './schemas/team.schema';
import { Iteam } from './interfaces/team.interface';
import { TeamInfoDTO } from './dto/team.dto';

@Injectable()
export class TeamsService {
    constructor(@InjectModel('Team') private readonly teamModel: Model<Iteam>) { }

    async createTeam(userId: string, teamDto: TeamInfoDTO) {
        const { teamName } = teamDto;
        const team = await this.teamModel.findOne({teamName: teamName})
        if(team) {
            throw new HttpException('This name already taken.', HttpStatus.BAD_REQUEST);
        }

        const createdTeam = new this.teamModel({ 
            ...teamDto, 
            leader: userId, 
            teamMembers: [userId] 
        });

        return createdTeam.save();
    }
}
