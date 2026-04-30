import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional: Makes PrismaService available everywhere without needing to import PrismaModule in every single module
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- Add this to make it accessible outside!
})
export class PrismaModule { }
