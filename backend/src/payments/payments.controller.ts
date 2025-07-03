import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getAllPayments(@Query() query: any) {
    return this.paymentsService.getAll(query);
  }

  @Get('/stats')
  getStats() {
    return this.paymentsService.getStats();
  }

  @Get(':id')
  getPaymentById(@Param('id') id: number) {
    return this.paymentsService.getOne(id);
  }

  @Post()
  addPayment(@Body() body: any) {
    return this.paymentsService.createPayment(body);
  }

}
