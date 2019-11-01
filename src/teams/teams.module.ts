import { Module, forwardRef } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema } from './schemas/team.schema';
import { UsersModule } from '../users/users.module';
import { EventRegistration } from '../shared/schemas/event-registration.schema';
import { RegisterEventModule } from '../register-event/register-event.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Team', schema: TeamSchema }]),
       UsersModule, forwardRef(() => RegisterEventModule)
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService]
})
export class TeamsModule { }
