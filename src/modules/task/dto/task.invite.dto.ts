import { ApiProperty } from "@nestjs/swagger";

export class TaskInviteDto {   
    @ApiProperty({ required: true})
    companyId: number;

    @ApiProperty({ required: true})
    taskId: number;
    
    @ApiProperty({ required: true})
    email: string;
}