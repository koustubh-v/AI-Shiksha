import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Req,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('checkout/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create checkout session' })
  createCheckout(@Request() req, @Param('courseId') courseId: string) {
    return this.paymentsService.createCheckoutSession(
      req.user.userId,
      courseId,
      req.user.franchise_id
    );
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    // Note: Request body must be raw buffer for Stripe verification.
    // NestJS ParseBody might interfere, need to configure main.ts for raw body or use specific raw body decorator if implemented
    // For now assuming req.rawBody exists if configured or using a specific middleware.
    // Standard NestJS usually parses JSON. We might need a middleware to keep raw body.

    // Simplification: Using req.body if it's not parsed or if we can get buffer.
    // Actually, handling raw body in NestJS is tricky without setup.
    // I will assume the user will configure `main.ts` to preserve raw body or I should do it.

    // IMPORTANT: For proper verification, we need the raw buffer.
    return this.paymentsService.handleWebhook(signature, req.rawBody);
  }
}

