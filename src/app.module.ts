import { Module } from '@nestjs/common';
import { APIModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CONSTANTS } from './config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';

@Module({
  imports: [MongooseModule.forRoot(CONSTANTS.URI, {}), APIModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule { }
