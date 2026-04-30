import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Invalid email address" })
    email: string;
    @IsOptional()
    @IsNotEmpty({ message: "First name is required" })
    firstName: string;
    @IsOptional()
    @IsNotEmpty({ message: "Last name is required" })
    lastName: string;
}
