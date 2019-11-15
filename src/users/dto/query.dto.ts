import { IsString, IsEmail, IsDate, IsNotEmpty } from "class-validator";

export class QueryDto {
    readonly filter?: string;

}