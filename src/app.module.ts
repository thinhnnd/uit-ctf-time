import { Module } from '@nestjs/common';
import { APIModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CONSTANTS } from './config';
@Module({
  imports: [MongooseModule.forRoot(CONSTANTS.URI, {}), APIModule]
})
export class AppModule { }
