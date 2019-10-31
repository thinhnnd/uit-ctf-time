import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IEventRegistration } from '../shared/interfaces/event-reg.interface';
import { TeamsService } from '../teams/teams.service';
import { CTFEventsService } from '../ctf-events/events.service';
@Injectable()
export class RegisterEventService {
    constructor(
        @InjectModel('EventRegistration') private readonly eventRegModel: Model<IEventRegistration>,
        private readonly teamService: TeamsService,
        private readonly ctfEventService: CTFEventsService
    ) { }

    async teamRegEvents(teamId: string, eventId: string) {
        const payload = {
            
        }
        const event = await this.ctfEventService.getCTFEvent(eventId);
        if(!event) throw new NotFoundException('CTF Event not found');
        const team = await this.teamService.getTeam(teamId);
        const registration = await this.eventRegModel.create
    }
}
