import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chats.schema';
import { ChatDto } from './chats.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async create(chatDto: ChatDto): Promise<Chat> {
    const createdChat = new this.chatModel(chatDto);
    return await createdChat.save();
  }
  async findAllByUserId(currentUserId: string): Promise<Chat[]> {
    return await this.chatModel
      .find({
        $or: [{ fromId: currentUserId }, { toId: currentUserId }],
      })
      .exec();
  }

  async findAllByText(text: string): Promise<Chat[]> {
    return await this.chatModel.find({ text }).exec();
  }

  async findOne(id: string): Promise<Chat> {
    return await this.chatModel.findById(id).exec();
  }

  async update(id: string, chatDto: ChatDto): Promise<Chat> {
    // TODO: check if user is authorized to update this chat
    return await this.chatModel
      .findByIdAndUpdate(id, chatDto, { new: true })
      .exec();
  }
  async remove(id: string): Promise<Chat> {
    return await this.chatModel.findByIdAndRemove(id).exec();
  }
}
