import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoicebanksService } from './voicebanks.service';
import { CreateVoicebankDto } from './dto/create-voicebank.dto';
import { UpdateVoicebankDto } from './dto/update-voicebank.dto';

@Controller('voicebanks')
export class VoicebanksController {
  constructor(private readonly voicebanksService: VoicebanksService) {}

  @Post()
  create(@Body() createVoicebankDto: CreateVoicebankDto) {
    return this.voicebanksService.create(createVoicebankDto);
  }

  @Get()
  findAll() {
    return this.voicebanksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voicebanksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoicebankDto: UpdateVoicebankDto) {
    return this.voicebanksService.update(+id, updateVoicebankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voicebanksService.remove(+id);
  }
}
