import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserCreateNewDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty({
    required: true
  })
  isVerified: boolean;

  @ApiProperty({
    required: true
  })
  firstName: string;

  @ApiProperty({
    required: true
  })
  lastName: string;
}
  