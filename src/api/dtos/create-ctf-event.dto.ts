export interface CreateCTFEventDto {
    "organizers": Array<any>,
    "start": Date,
    "finish": Date,
    "description": String,
    "weight": Number,
    "title": String,
    "duration": {
        "hours": Number,
        "days": Number
    },
}