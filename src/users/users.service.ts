import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUsersDto, UsersDto } from './users.dto';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userDto: UsersDto): Promise<User> {
    const createdUser = await this.userModel.create(userDto);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return (await this.userModel.find().exec()).map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      age: user.age,
      password: '****',
    }));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      age: user.age,
      password: '****',
    } as User;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const result = await this.userModel
      .findOne({
        email,
      })
      .exec();
    if (!result) return;
    if (result.email === email) {
      return result;
    } else {
      return;
    }
  }

  async update(userDto: UpdateUsersDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: userDto.email },
      {
        $set: {
          name: userDto.name,
          age: userDto.age,
        },
      },
      { new: true },
    );

    return {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      age: updatedUser.age,
      password: '****',
    } as User;
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();

    return {
      id: deletedUser._id,
      email: deletedUser.email,
      name: deletedUser.name,
      age: deletedUser.age,
      password: '****',
    } as User;
  }
}
