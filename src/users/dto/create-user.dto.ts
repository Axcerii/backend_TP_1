import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Invalid email address" })
    email: string;
    @IsNotEmpty({ message: "Name is required" })
    name: string;
}
