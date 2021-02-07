import { ApiProperty } from '@nestjs/swagger';

export class ProjectPatchDto {
    @ApiProperty()
    projectName: string;

    @ApiProperty()
    dueDate: Date;

    @ApiProperty()
    latestUpdate: Date
}