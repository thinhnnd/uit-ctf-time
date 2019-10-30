import { Controller, Get, Post, Body, Req, Res, Query, Param, NotFoundException, InternalServerErrorException } from "@nestjs/common";
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
            if (events)
                return res.json(events);
            else throw new NotFoundException("Can not find all events");
        }
        catch (err) {
            console.log("CTFEventsController/Get/api/v1/events error", err);
            throw new InternalServerErrorException();
        }
    }
    @Get("/events/:id")
    async getEvent(@Req() req: Request, @Res() res: Response) {
        const id = req.params.id;
        try {
            const event = await this.CTFEventsService.getCTFEvent(id);
            if (event)
                return res.json(event);
            else throw new NotFoundException("Not found event");
        } catch (error) {
            console.log("CTFEventsController/Get/api/v1/events query failed", error);
            if (error.status !== 404)
                throw new InternalServerErrorException(`CTFEventsController/Get/api/v1/events/${id} query failed`);
            throw error;
        }
    }
    @Post('/events')
    async createEvent(@Res() res: Response, @Body() event) {
        try {
            const data = new CreateCTFEventDto({ ...event });
            const result = await this.CTFEventsService.createCTFEvent(data);
            if (result) res.json(result)
        } catch (error) {
            console.log("CTFEventsController/Post/api/v1/events command failed", error);
            throw new InternalServerErrorException();
        }
    }
}