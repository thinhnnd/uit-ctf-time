import { Controller, UseGuards, Post, Body, BadRequestException, Get, Req, Delete, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterEventService } from './register-event.service';
import { RegisterCTFEventDTO } from './dto/register-event.dto';
import { User } from '../users/user.decorator';


@Controller('/api/v1/register-event')
export class RegisterEventController {
    constructor(private readonly registrationService: RegisterEventService) { }
    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    async registerEvent(@User('userId') userId, @Body() registration: RegisterCTFEventDTO) {
        try {
            const { teamId, eventId } = registration;
            if (!teamId || !eventId) throw new BadRequestException('Invalid body');
            return await this.registrationService.teamRegEvents(userId, registration);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async cancelRegistration(@Body() reg: RegisterCTFEventDTO) {
        return await this.registrationService.teamCancelEventRegistration(reg);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getEventRegistered() {
        return await this.registrationService.findEvents({});
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('/event')
    async getEvent(@Query() q) {
        return await this.registrationService.findEventById(q.id);
    }

    @Get('/rank')
    async ranking(@Query() query) {
        return await this.registrationService.ranking(query.event);
    }
}
