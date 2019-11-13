import { IsString, IsNotEmpty, Length, IsArray, Max, ArrayMaxSize } from "class-validator";

export class TeamInfoDTO {
    @IsNotEmpty()
    @IsString()
    @Length(4, 50)
    readonly teamName: string;

    @IsArray()
    @ArrayMaxSize(4)
    readonly members?: string[];
}
