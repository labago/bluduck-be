import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordChangePayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()  
  newPassword: string;
}
