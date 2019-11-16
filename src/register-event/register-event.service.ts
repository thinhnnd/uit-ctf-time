import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException, forwardRef, Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IEventRegistration } from '../shared/interfaces/event-reg.interface';
import { TeamsService } from '../teams/teams.service';
import { CTFEventsService } from '../ctf-events/events.service';
import { RegisterCTFEventDTO } from './dto/register-event.dto';
import { Iteam } from '../teams/interfaces/team.interface';
@Injectable()
export class RegisterEventService {
    constructor(
        @InjectModel('Event_registration') private readonly eventRegModel: Model<IEventRegistration>,
        @Inject(forwardRef(() => TeamsService))
        private readonly teamService: TeamsService,
        private readonly ctfEventService: CTFEventsService
    ) { }

    async teamRegEvents(leaderId: string, data: RegisterCTFEventDTO): Promise<IEventRegistration> {
        try {
            const { teamId, eventId } = data;
            const event = await this.ctfEventService.getCTFEvent(eventId);
            if (!event._id) throw new NotFoundException('CTF Event not found');
            const team = await this.teamService.getTeam(teamId);
            if (!team) throw new NotFoundException('Team not found');
            if (team.leader != leaderId) throw new UnauthorizedException('Only leader can be registered this event');
            const isExisted = await this.eventRegModel.find({ $and: [{ teamId: teamId }, { eventId: eventId }] });
            if (isExisted.length > 0) throw new UnprocessableEntityException('Your team already registered this event');
            const registration = await this.eventRegModel.create(data);
            if (registration) {
                const teamUpdated = await this.teamService.registerCTFEvent(teamId, eventId);
                console.log(teamUpdated.eventsRegistration);
                return registration;
            }
            else throw new UnprocessableEntityException('Unable to register event');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async teamUpdateEvent(condition: object, update: RegisterCTFEventDTO): Promise<IEventRegistration> {
        const updatedEvent = await this.eventRegModel.findOneAndUpdate(condition, update, { new: true });
        if (updatedEvent) {
            delete update.teamId;
            const updatedTeam = await this.teamService.findOneAndUpdate({ _id: update.teamId }, { ...update }, { new: true })
            if (updatedTeam) {
                return updatedEvent;
            }
        }
        else throw new NotFoundException('Not Found Event to update');
    }
    async findEventById(eventId: string): Promise<IEventRegistration> {
        const event = await this.eventRegModel.findById(eventId);
        if (!event) throw new NotFoundException('Not found registration');
        return event;
    }
    async findEvents(options: object): Promise<IEventRegistration[]> {
        return await this.eventRegModel.find(options);
    }
    async teamCancelEventRegistration(event: RegisterCTFEventDTO): Promise<IEventRegistration> {
        const canceledEvent = await this.eventRegModel.findOneAndDelete({ eventId: event.eventId });
        const updatedTeam = await this.teamService.findOneAndUpdate(
            { _id: event.teamId },
            { $pull: { eventsRegistration: { event: event.eventId } } },
            { new: true });
        if (updatedTeam) {
            return canceledEvent;
        }
        else { throw new InternalServerErrorException('Unable to update event of team') }
    }
    async ranking(eventId: string) {
        try {
            const events = await this.findEvents({ eventId });
            const promises: Array<Promise<Iteam>> = [];
            events.forEach(event => {
                promises.push(this.teamService.getTeam(event.teamId));
            });
            const teams = await Promise.all(promises);
            Logger.log(teams, ' ranking get teams ');
            const scorePromises: Array<Promise<{ team: string, teamId: string, score: number }>> = [];
            teams.forEach(team => {
                scorePromises.push(this.teamService.getGradeOfEventForTeam(team.id, eventId));
            });
            const scores = await Promise.all(scorePromises);
            scores.sort((a, b) => (a.score > b.score) ? 1 : (a.score === b.score) ? ((a.team > b.team) ? 1 : -1) : -1);
            return scores;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTeamOnAnEvent(eventId: string) {
        try {
            const events = await this.findEvents({ eventId });
            const promises: Array<Promise<Iteam>> = [];
            events.forEach(event => {
                promises.push(this.teamService.getTeam(event.teamId));
            });
            const teams = await Promise.all(promises);
            const scorePromises: Array<Promise<{ team: string, teamId: string, score: number }>> = [];
            teams.forEach(team => {
                scorePromises.push(this.teamService.getGradeOfEventForTeam(team.id, eventId));
            });
            const scores = await Promise.all(scorePromises);
            return scores;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }
}
