import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.schema';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import TestUtil from '../common/test/TestUtil';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserService,
      ],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    mockRepository.findOne.mockReset();
    mockRepository.findOneAndUpdate.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When serch User By Id', () => {
    it('should find a existing user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findByIdUser('1');
      expect(userFound).toMatchObject({ nickname: user.nickname });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findByIdUser('2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('When create user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      mockRepository.save.mockReturnValue(user);
      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  it('should return a exception when doesnt create a user', async () => {
    const user = TestUtil.giveAMeAValidUser();
    mockRepository.save.mockReturnValue(null);

    await service.createUser(user).catch(e => {
      expect(e).toBeInstanceOf(InternalServerErrorException);
      expect(e).toMatchObject({
        message: 'Problem to create a user. Try again',
      });
    });
    expect(mockRepository.save).toBeCalledTimes(1);
  });
});
  describe('When update User', () => {
    it('Should update a user', async () => {
      const user = TestUtil.giveAMeAValidUser();
      const updatedUser = { name: 'Nome Atualizado' };
      mockRepository.findOneAndUpdate.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.save.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'Nome Atualizado',
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(mockRepository.findOneAndUpdate).toBeCalledTimes(1);
    });
  });
});