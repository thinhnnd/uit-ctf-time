import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { CTFEventSchema } from './schemas/ctf-event.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'CTF_Event', schema: CTFEventSchema }]),],
    providers: [ApiService],
    controllers: [ApiController]
})
export class APIModule { }