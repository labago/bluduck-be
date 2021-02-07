import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectCreateDto {
    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    projectName: string;

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    dueDate: Date;

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    latestUpdate: Date

    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    companyId: number;
}