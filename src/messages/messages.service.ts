import { Injectable } from '@nestjs/common';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
//import { CACHE_MANAGER } from '@nestjs/cache-manager';
//import { Cache } from 'cache-manager';

@Injectable()
export class MessagesService {
    constructor(@InjectRepository(Message) private readonly repo: Repository<Message>) {}

    async sendMessage(senderId: number, receiverId: number, content: string){
        const message = this.repo.create({ senderId, receiverId, content });
        return this.repo.save(message);
    }

    async getConversation(userA: number, userB: number) {
        return this.repo.find({
            where: [
                { senderId: userA, receiverId: userB },
                { senderId: userB, receiverId: userA }
            ],
            order: { createdAt: 'ASC' },
        });
    }
}
