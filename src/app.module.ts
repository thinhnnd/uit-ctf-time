import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CONSTANTS } from './config';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { CTFEventsModule } from './ctf-events/events.module';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost/uit-ctf-time', 
      {
         useNewUrlParser: true,
         useUnifiedTopology: true
      }), 
      CatsModule, 
      UsersModule, 
      AuthModule, 
      CTFEventsModule, TeamsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
  ],
})
export class AppModule { }
