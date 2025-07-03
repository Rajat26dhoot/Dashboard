import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type PaymentStatus = 'success' | 'failed' | 'pending';
export type PaymentMethod = 'upi' | 'card' | 'bank' | 'cash';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  receiver: string;

  @Column({ type: 'enum', enum: ['success', 'failed', 'pending'] })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: ['upi', 'card', 'bank', 'cash'] })
  method: PaymentMethod;

  @CreateDateColumn()
  createdAt: Date;
}
