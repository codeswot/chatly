import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';
export class UsersDto {
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsNumberString()
  readonly age: number;
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateUsersDto {
  @IsEmail()
  readonly email: string;
  readonly name: string;
  @IsNumberString()
  readonly age: number;
}
