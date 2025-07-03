import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type Role = 'admin' | 'viewer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'viewer' })
  role: Role;
}
