import { Controller, Get, Post, Body, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiService } from "./api.service";
@Controller()
export class ApiController {
    constructor(private readonly apiService: ApiService) { }
    @Get('/api/v1/events')
    async getEvents(@Req() req: Request, @Res() res: Response) {
        try {
            const events = await this.apiService.getCTFEvents();
            res.json(events);
        }
        catch (err) {
            console.log("ApiController/Get/api/v1/events error", err);
        }
    }
}