import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArtistsModule } from './artists/artists.module';
import { VoicebanksModule } from './voicebanks/voicebanks.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from "./auth/auth";
@Module({
  imports: [UsersModule, PrismaModule, ArtistsModule, VoicebanksModule, AuthModule.forRoot(auth)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
