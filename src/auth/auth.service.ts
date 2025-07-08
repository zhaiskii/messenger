import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
    email: string;
    id: number;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService //razberis' tut
    ) {}

    async register(email: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({email, password: hashed });
        console.log(user);
        return user;
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    
    async login(user: {id: number, email: string, password: string}) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    getUserFromToken(token: string): JwtPayload|null {
        try {
            const decoded = this.jwtService.verify<JwtPayload>(token);
            return decoded;
        } catch (error) {
            console.error('error in decoding jwt', error);
            return null;
        }
    }
}
