import { Global, Module } from '@nestjs/common';
import { GlobalErrorHandler } from './middleware/globalErrorHandler.middleware';

@Global()
@Module({
  providers: [GlobalErrorHandler],
})
export class CommonModule {}
