import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema } from './schemas/team.schema';
import { UsersModule } from '../users/users.module';
import { EventRegistration } from '../shared/schemas/event-registration.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Team', schema: TeamSchema },
      { name: 'EventRegistration', schema: EventRegistration }
    ]), UsersModule
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService]
})
export class TeamsModule { }
