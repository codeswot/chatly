import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  readonly roomId: string;
  //   TODO: encrypt text later.
  @IsString()
  readonly text: string;
  @IsString()
  readonly fromId: string;
  @IsString()
  readonly toId: string;
  @IsString()
  readonly timestamp: string;
  @IsString()
  readonly replyId: string;
  //   TODO: manage media later.
  @IsString()
  readonly mediaUrl: string;
  @IsString()
  readonly mediaType: string;
}

export class UpdateChatDto {
  @IsString()
  readonly chatId: string;
  @IsString()
  readonly roomId: string;
  //   TODO: encrypt text later.
  @IsString()
  readonly text: string;
  @IsString()
  readonly fromId: string;
  @IsString()
  readonly toId: string;
  @IsString()
  readonly timestamp: string;
  @IsString()
  readonly replyId: string;
  //   TODO: manage media later.
  @IsString()
  readonly mediaUrl: string;
  @IsString()
  readonly mediaType: string;
}

export class DeleteChatDto {
  @IsString()
  readonly chatId: string;
  @IsString()
  readonly roomId: string;
}
