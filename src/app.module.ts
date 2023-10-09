import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChatsModule,
    EventsModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/test',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
