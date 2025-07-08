import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['senderId', 'receiverId'])
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column()
    receiverId: number;

    @Column('text')
    content: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}