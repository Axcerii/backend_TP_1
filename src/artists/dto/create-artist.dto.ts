import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
    IsInt,
} from 'class-validator';

export class CreateArtistDto {
    @IsString()
    @IsNotEmpty({ message: 'Nickname is required' })
    nickname: string;

    @IsOptional()
    @IsString()
    realName?: string;

    @IsOptional()
    @IsString()
    oldName?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    jobs?: string[];

    @IsOptional()
    @IsString()
    description?: string;

    /** IDs of artists to link as associated artists */
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    associatedArtistIds?: number[];

    /** IDs of voice banks to link to this artist */
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    voiceBankIds?: number[];
}
