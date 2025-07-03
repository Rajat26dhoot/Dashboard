import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Role } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminExists = await this.userRepo.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 10);
      const admin = this.userRepo.create({ username: 'admin', password: hashed, role: 'admin' });
      await this.userRepo.save(admin);
      console.log('✅ Seeded default admin user (username: admin / password: admin123)');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async create(username: string, password: string, role: Role): Promise<Omit<User, 'password'>> {
    const existing = await this.findByUsername(username);
    if (existing) throw new Error('Username already exists');

    const hashed = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({ username, password: hashed, role });
    const saved = await this.userRepo.save(newUser);
    const { password: _, ...rest } = saved;
    return rest;
  }
}
