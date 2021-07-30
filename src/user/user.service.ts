import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    try {
      const createUser = new this.userModel(user);
      return await createUser.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateUser(
    _id: string,
    user: User,
  ): Promise<User> {
    try {
      const { password, nickname, mail } = user;
      const userUpdated = await this.userModel
        .findOneAndUpdate(
          { _id },
          { $set: { password, nickname, mail } },
          { new: true },
        )
        .exec();

      return userUpdated;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findByIdUser(_id: string): Promise<User> {
    try {
      return await this.userModel.findOne({ _id }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findByLoginUser(nickname: string): Promise<User> {
    try {
      return await this.userModel.findOne({ nickname }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
