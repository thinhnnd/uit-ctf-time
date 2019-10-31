import { Module } from '@nestjs/common';
import { RegisterEventService } from './register-event.service';
import { RegisterEventController } from './register-event.controller';
import { TeamsModule } from '../teams/teams.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRegistration } from '../shared/schemas/event-registration.schema';
import { CTFEventsModule } from '../ctf-events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'EventRegistration', schema: EventRegistration }]),
    TeamsModule, CTFEventsModule
  ],
  providers: [RegisterEventService],
  controllers: [RegisterEventController]
})
export class RegisterEventModule { }
