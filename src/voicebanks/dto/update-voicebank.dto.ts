import { PartialType } from '@nestjs/mapped-types';
import { CreateVoicebankDto } from './create-voicebank.dto';

export class UpdateVoicebankDto extends PartialType(CreateVoicebankDto) {}
