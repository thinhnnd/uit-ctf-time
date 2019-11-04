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
import { RegisterEventModule } from './register-event/register-event.module';
import * as dotenv from 'dotenv';

dotenv.config();
const devURI = 'mongodb://localhost/uit-ctf-time';
const prodURI = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0-wd6gd.gcp.mongodb.net/test?retryWrites=true&w=majority`;
@Module({
	imports: [
		MongooseModule.forRoot(
			prodURI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
				useCreateIndex: true,
			}),
		CatsModule,
		UsersModule,
		AuthModule,
		CTFEventsModule, TeamsModule, RegisterEventModule,
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
