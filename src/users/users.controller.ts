import {
  Body,
  // Body,
  Controller,
  // Delete,
  Get,
  Param,
  Put,
  UseGuards,
  // Post,
  // ValidationPipe,
  // UsePipes,
  // Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersDto } from './users.dto';
import { User } from './users.schema';
import { UpdateUsersDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async create(@Body() userDto: UsersDto): Promise<string> {
  //   await this.usersService.create(userDto);
  //   return 'User created successfully';
  // }

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      return {
        email: user.email,
        name: user.name,
        age: user.age,
        _id: user._id,
      } as User;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('')
  async update(@Body() userDto: UpdateUsersDto): Promise<User> {
    return this.usersService.update(userDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.usersService.delete(id);
  // }
}
