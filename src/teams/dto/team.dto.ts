import { IsString, IsNotEmpty, Length, IsArray, Max, ArrayMaxSize, IsOptional } from "class-validator";

export class TeamInfoDTO {
    @IsNotEmpty()
    @IsString()
    @Length(4, 50)
    readonly teamName: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(4)
    readonly members?: string[];
}
