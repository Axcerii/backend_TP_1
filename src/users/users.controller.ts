import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('me')
  async getProfile(@nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession) {
    return { user: session.user };
  }
  @Get('public')
  @nestjsBetterAuth.AllowAnonymous() // Allow anonymous access
  async getPublic() {
    return { message: 'Public route' };
  }
  @Get('optional')
  @nestjsBetterAuth.OptionalAuth() // Authentication is optional
  async getOptional(@nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession) {
    return { authenticated: !!session };
  }
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
