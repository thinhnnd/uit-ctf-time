import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { Logger } from '@nestjs/common';

@Controller('cats')
export class CatsController {
    private logger = new Logger('CatsController');

    constructor(private readonly catsService: CatsService) {}

    private logData(options: any) {
        options.user && this.logger.log('USER ' + JSON.stringify(options.user));
        options.body && this.logger.log('DATA ' + JSON.stringify(options.body));
        options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
    }

    @Post()
    async create(@Body() data: CreateCatDto) {
        // this.logger.log(data);
        this.logData({data})
        return this.catsService.create(data);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }
}