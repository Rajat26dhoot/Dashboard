import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { Repository, Between } from 'typeorm';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async createPayment(data: {
    amount: number;
    receiver: string;
    method: PaymentMethod;
    status: PaymentStatus;
  }) {
    const payment = this.paymentRepo.create(data);
    return this.paymentRepo.save(payment);
  }

  async getAll(filters: {
    status?: PaymentStatus;
    method?: PaymentMethod;
    startDate?: string;
    endDate?: string;
  }) {
    const query = this.paymentRepo.createQueryBuilder('payment');

    if (filters.status) query.andWhere('payment.status = :status', { status: filters.status });
    if (filters.method) query.andWhere('payment.method = :method', { method: filters.method });

    if (filters.startDate)
      query.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });

    if (filters.endDate)
      query.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });

    return query.orderBy('payment.createdAt', 'DESC').getMany();
  }

  async getOne(id: number) {
    return this.paymentRepo.findOne({ where: { id } });
  }

  async getStats() {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Start from 00:00:00.000 of 7 days ago
   const startOfRange = new Date();
    startOfRange.setDate(now.getDate() - 7);
    startOfRange.setHours(0, 0, 0, 0);

  // End at 23:59:59.999 of today
     const endOfRange = new Date();
     endOfRange.setHours(23, 59, 59, 999);

    const payments = await this.paymentRepo.find({
      where: { createdAt: Between(startOfRange, endOfRange) },
    });

    const total = payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const today = payments.filter(p => new Date(p.createdAt).toDateString() === now.toDateString());
    const failed = payments.filter(p => p.status === 'failed');

    return {
      totalPaymentsToday: today.length,
      totalRevenue: total,
      failedTransactions: failed.length,
      revenueLast7Days: this.groupByDay(payments),
    };
  }

  private groupByDay(payments: Payment[]) {
    const map: Record<string, number> = {};
    payments.forEach(p => {
      const day = new Date(p.createdAt).toISOString().split('T')[0];
      map[day] = (map[day] || 0) + Number(p.amount);
    });
    return map;
  }
}
