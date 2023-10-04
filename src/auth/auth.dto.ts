import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty, Length } from 'class-validator';
export class AuthDto {
  @ApiProperty({
    description: 'Must be a valid email address (e.g., email@provider.domain)',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;
  @ApiProperty({
    description: 'Must be alphanumeric with at least 8 characters',
  })
  @IsNotEmpty({ message: 'Password can not be empty' })
  @Length(8, 255, {
    message: 'Must be at least 8 characters long',
  })
  @IsAlphanumeric('en-US', { message: 'Must be alphanumeric' })
  readonly password: string;
}
