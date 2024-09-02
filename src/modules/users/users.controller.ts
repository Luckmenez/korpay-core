import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from '../auth/role.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authGuard: AuthGuard,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get('orders')
  getOrders() {
    return this.usersService.getOrders();
  }

  @Get('user-by-email/:email')
  userByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post('update-spread')
  updateSpread(@Body() body: { spread: string; email: string }) {
    return this.usersService.updateSpread(body);
  }
}
