import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateUsersDto, UsersDto } from './users.dto';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userDto: UsersDto): Promise<User> {
    const createdUser = await this.userModel.create({
      id: new mongoose.Types.ObjectId(),
      ...userDto,
    });
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    return user;
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
      ...updatedUser,
      password: '****',
    } as User;
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();

    return {
      ...deletedUser,
      password: '****',
    } as User;
  }
}
