import { IsString, IsArray } from 'class-validator';
export class CreateCTFEventDto {
    @IsArray()
    "organizers": Array<any>
    @IsString()
    "start": Date
    "finish"?: Date
    @IsString()
    "description": string
    "weight": Number
    @IsString()
    "title": string
    "duration": {
        "hours": Number
        "days": Number
    }
    "id"?: number
    constructor(...args: any) {
        const { organizers, start, duration, description, weight, title } = args[0];
        organizers ? this.organizers = organizers : [];
        start ? this.start = new Date(start) : new Date();
        duration ? this.duration = duration : { hours: 8, days: 0 }
        title ? this.title = title : "New CTF Event";
        weight ? this.weight = weight : 0;
        description ? this.description = description : "New CTF Event Description";
        this.finish = this.getFinishedEventDate(this.start, this.duration);
        this.id = Math.floor(Math.random() * 999);
    }
    private getFinishedEventDate(start: Date, duration: any): Date {
        const startDate = new Date(start);
        let { hours, days } = duration;
        let finish: number = 0;
        hours = days > 0 ? hours += days * 24 : hours;
        finish = startDate.setHours(hours);
        const finishDate = new Date(finish);
        return finishDate;
    }
}