import { Get, Query, Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('search')
    async searchUser(@Query('username') email: string) {
        return this.usersService.findByEmail(email);
    };
};