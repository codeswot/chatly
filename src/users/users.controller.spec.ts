import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;
  const userDto: UsersDto = {
    name: 'Musa Damu',
    email: 'test@gmail.com',
    age: 14,
    password: '***',
  };

  // const mockUser = {
  //   name: 'Musa Damu',
  //   email: 'test@gmail.com',
  //   age: 14,
  //   password: '***',
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'Musa Damu',
                email: 'test@gmail.com',
                age: 23,
                password: '***',
              },
              {
                name: 'Aisha Damu',
                email: 'test2@gmail.com',
                age: 19,
                password: '***',
              },
              {
                name: 'Musa Damu jr',
                email: 'test3@gmail.com',
                age: 5,
                password: '***',
              },
            ]),
            create: jest.fn().mockResolvedValue(userDto),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // describe('create()', () => {
  //   it('should create a new user', async () => {
  //     const createSpy = jest
  //       .spyOn(service, 'create')
  //       .mockResolvedValueOnce(mockUser);

  //     await controller.create(userDto);
  //     expect(createSpy).toHaveBeenCalledWith(userDto);
  //   });
  // });

  describe('findAll()', () => {
    it('should return an array of user', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          name: 'Musa Damu',
          email: 'test@gmail.com',
          age: 23,
          password: '***',
        },
        {
          name: 'Aisha Damu',
          email: 'test2@gmail.com',
          age: 19,
          password: '***',
        },
        {
          name: 'Musa Damu jr',
          email: 'test3@gmail.com',
          age: 5,
          password: '***',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
