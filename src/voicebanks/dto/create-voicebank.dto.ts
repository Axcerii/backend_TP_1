import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';

export class CreateVoicebankDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    language?: string[];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    software?: string[];
}
