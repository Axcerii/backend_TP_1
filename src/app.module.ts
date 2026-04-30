import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArtistsModule } from './artists/artists.module';
import { VoicebanksModule } from './voicebanks/voicebanks.module';

@Module({
  imports: [UsersModule, PrismaModule, ArtistsModule, VoicebanksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
