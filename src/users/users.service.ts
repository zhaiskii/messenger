import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private readonly repo: Repository<Users>) {}

    async create(data: {email: string, password: string}): Promise<Users> {
        const newUser = this.repo.create(data);
        return await this.repo.save(newUser);;
    }

    async findByEmail(email: string): Promise<Users | null> {
        return this.repo.findOne({ where: {email} });
    }
}
 