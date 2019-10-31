import { IsString, IsNotEmpty, Length } from "class-validator";

export class TeamInfoDTO {
    @IsNotEmpty()
    @IsString()
    @Length(4, 255)
    readonly teamName: string;
}
