import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LogUserInDto {
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, minLength: 5, maxLength: 320})
  email!: string;

  @MaxLength(30)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, minLength: 8, maxLength: 30 })
  password!: string;
}
