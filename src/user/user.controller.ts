import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from './user.schema';
import { UserService } from './user.service';

const ackErrors: string[] = ['E11000'];

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('create-user')
  async createUser(
    @Payload() user: User,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let confirmation = true;

    try {
      return await this.userService.createUser(user);
    } catch (error) {
      confirmation = false;
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    } finally {
      if (confirmation) await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-user')
  async updateUser(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let confirmation = true;

    const _id: string = data._id;
    const user: User = data.updateUserInput;

    try {
      return await this.userService.updateUser(_id, user);
    } catch (error) {
      confirmation = false;
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    } finally {
      if (confirmation) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('find-by-id-user')
  async findByIdUser(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      return await this.userService.findByIdUser(_id);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
