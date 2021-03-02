import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  email: string;
}
