import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Role } from './users.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(@Request() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException();
    return this.usersService.findAll();
  }

  @Post()
  async createUser(
    @Request() req,
    @Body() body: { username: string; password: string; role: Role },
  ) {
    if (req.user.role !== 'admin') throw new ForbiddenException();
    return this.usersService.create(body.username, body.password, body.role);
  }
}
