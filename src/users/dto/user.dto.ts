import { IsString, IsEmail, IsDate, IsNotEmpty } from "class-validator";

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    readonly full_name: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    role: string;

    readonly date_of_birth: Date;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}