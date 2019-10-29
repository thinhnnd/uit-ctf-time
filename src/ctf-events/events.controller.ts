import { Controller, Get, Post, Body, Req, Res, Query } from "@nestjs/common";
import { Request, Response } from 'express';
import { CTFEventsService } from "./events.service";
import { CreateCTFEventDto } from "./dtos/create-ctf-event.dto";
@Controller('/api/v1')
export class CTFEventsController {
    constructor(private readonly CTFEventsService: CTFEventsService) { }
    @Get('/events')
    async getEvents(@Req() req: Request, @Res() res: Response) {
        try {
            const events = await this.CTFEventsService.getCTFEvents();
            res.json(events);
        }
        catch (err) {
            console.log("CTFEventsController/Get/api/v1/events error", err);
        }
    }
    @Get("/events")
    async getEvent(@Query('id') id: string, @Res() res: Response) {
        try {
            const event = await this.CTFEventsService.getCTFEvent(id);
            res.json(event);
        } catch (error) {
            console.log("CTFEventsController/Get/api/v1/events query failed", error);
        }
    }
    @Post('/events')
    async createEvent(@Res() res: Response, @Body() event: CreateCTFEventDto) {
        try {
            const result = await this.CTFEventsService.createCTFEvent(event);
            if (result) res.json(result)
        } catch (error) {
            console.log("CTFEventsController/Post/api/v1/events command failed", error);
        }
    }
}