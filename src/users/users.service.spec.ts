import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './users.schema';

const mockUser = {
  name: 'Musa Damu',
  email: 'test@gmail.com',
  age: 23,
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const usersArray = [
    {
      name: 'Musa Damu',
      email: 'test@gmail.com',
      age: 23,
    },
    {
      name: 'Aisha Damu',
      email: 'test2@gmail.com',
      age: 19,
    },
    {
      name: 'Musa Damu jr',
      email: 'test3@gmail.com',
      age: 5,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersArray),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(usersArray);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        name: 'Musa Damu',
        email: 'test@gmail.com',
        age: 23,
      } as any),
    );
    const newUser = await service.create({
      name: 'Musa Damu',
      email: 'test@gmail.com',
      age: 23,
      password: 'password',
    });
    expect(newUser).toEqual(mockUser);
  });
});
