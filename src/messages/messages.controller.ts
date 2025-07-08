import { Controller, Get, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthService } from '../auth/auth.service';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    getMessages(
        @Query('receiverId') receiver: number,
        @Headers('Authorization') header: string,
    ) {
        const token = header?.replace('Bearer ', '');
        const sender = this.authService.getUserFromToken(token);

        if(!sender) {
            throw new UnauthorizedException('Invalid Token');
        }

        return this.messagesService.getConversation(sender.id, receiver);
    }
}