import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';

class NameDto {
    @IsString()
    @IsNotEmpty({ message: 'First name cannot be empty' })
    firstName: string;
    @IsString()
    @IsNotEmpty({ message: 'Last name cannot be empty' })
    lastName: string;
}

export class UpdateUserDto extends PartialType(NameDto) { }

