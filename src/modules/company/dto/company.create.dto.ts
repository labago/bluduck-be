import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from "modules/user/dto/user.dto";

export class CompanyCreateDto {
    @ApiProperty({
        required: true,
      })
    @IsNotEmpty()
    companyName: string;
}