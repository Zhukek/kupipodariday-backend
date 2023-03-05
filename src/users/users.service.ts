import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import {
  emailAlreadyExistsError,
  usernameAlreadyExistsError,
} from 'src/utils/errors';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.save({
      ...dto,
      password: await this.hashService.hash(dto.password),
    });
  }

  async findMany(str: string): Promise<User[]> {
    return this.userRepository.find({
      where: [{ username: Like(`%${str}%`) }, { email: Like(`%${str}%`) }],
    });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
  }

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOneBy({ username: name });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email: email });
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException();
    }

    if (dto.username && dto.username !== user.username) {
      const anotherUser = await this.findByName(dto.username);

      if (dto?.username === anotherUser?.username) {
        throw new BadRequestException(usernameAlreadyExistsError);
      }
    }

    if (dto.email && dto.email !== user.email) {
      const anotherUser = await this.findByEmail(dto.email);

      if (dto?.email === anotherUser?.email) {
        throw new BadRequestException(emailAlreadyExistsError);
      }
    }

    if (dto.password) {
      dto = {
        ...dto,
        password: await this.hashService.hash(dto.password),
      };
    }

    const updateData: User = {
      ...user,
      ...dto,
    };

    await this.userRepository.update(user.id, updateData);

    return this.findById(user.id);
  }

  async getWishesByUserName(name: string): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { username: name } },
      relationLoadStrategy: 'join',
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }
}
