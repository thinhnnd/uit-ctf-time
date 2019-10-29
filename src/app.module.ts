import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CONSTANTS } from './config';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { APIModule } from './api/api.module';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
@Module({
	imports: [MongooseModule.forRoot(CONSTANTS.URI,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}),
		APIModule, CatsModule, UsersModule],
	providers: [{
		provide: APP_FILTER,
		useClass: HttpErrorFilter
	},
	{
		provide: APP_INTERCEPTOR,
		useClass: LoggingInterceptor
	}]
})
export class AppModule { }
