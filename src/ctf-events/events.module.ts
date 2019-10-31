import { Module } from '@nestjs/common';
import { CTFEventsService } from './events.service';
import { CTFEventsController } from './events.controller';
import { CTFEventSchema } from './schemas/ctf-event.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'CTF_Event', schema: CTFEventSchema }]),],
    providers: [CTFEventsService],
    controllers: [CTFEventsController],
    exports:[CTFEventsService]
})
export class CTFEventsModule { }