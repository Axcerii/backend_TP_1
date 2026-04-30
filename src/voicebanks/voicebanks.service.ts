import { Injectable } from '@nestjs/common';
import { CreateVoicebankDto } from './dto/create-voicebank.dto';
import { UpdateVoicebankDto } from './dto/update-voicebank.dto';

@Injectable()
export class VoicebanksService {
  create(createVoicebankDto: CreateVoicebankDto) {
    return 'This action adds a new voicebank';
  }

  findAll() {
    return `This action returns all voicebanks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voicebank`;
  }

  update(id: number, updateVoicebankDto: UpdateVoicebankDto) {
    return `This action updates a #${id} voicebank`;
  }

  remove(id: number) {
    return `This action removes a #${id} voicebank`;
  }
}
