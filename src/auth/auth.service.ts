import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersDto } from 'src/users/users.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<object> {
    const user = await this.usersService.findOneByEmail(email);
    if (user === undefined) {
      throw new UnauthorizedException('User with this credential not found');
    }
    if (user?.password !== password) {
      throw new UnauthorizedException('Wrong password');
    }
    const payload = {
      id: user._id,
      email: user.email,
      age: user.age,
      name: user.name,
      password: '***',
    };
    return {
      token: await this.jwtService.signAsync(payload),
      data: payload,
    };
  }

  async signUp(email: string, password: string): Promise<object> {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const userDto = {
      password: password,
      email: email,
      name: null,
      age: null,
    } as UsersDto;
    const user = await this.usersService.create(userDto);
    const payload = {
      id: user._id,
      email: user.email,
      age: user.age,
      name: user.name,
      password: '***',
    };

    return {
      token: await this.jwtService.signAsync(payload),
      data: payload,
    };
  }
}
