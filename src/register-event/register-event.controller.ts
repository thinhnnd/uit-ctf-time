import { Controller, UseGuards, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterEventService } from './register-event.service';
import { RegisterCTFEventDTO } from './dto/register-event.dto';
import { User } from '../users/user.decorator';


@UseGuards(AuthGuard('jwt'))
@Controller('/api/v1/register-event')
export class RegisterEventController {
    constructor(private readonly registrationService: RegisterEventService) { }
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
}
