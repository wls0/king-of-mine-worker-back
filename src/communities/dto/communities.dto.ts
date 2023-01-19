import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendGoldDTO {
  @ApiProperty({
    example: 600,
    description: 'gold',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  gold: number;
  @ApiProperty({
    example: 'sfgksdlgmslkdmv',
    description: 'recevieUser',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  receiveUser: string;

  @ApiProperty({
    example: 'sfgksdlgmslkdmv',
    description: 'message',
    required: true,
  })
  @IsString()
  message: string;
}

export class ReceiveGoldDTO {
  @ApiProperty({
    example: 'sfgksdlgmslkdmv',
    description: 'giftIndex',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  giftIndex: string;
}
