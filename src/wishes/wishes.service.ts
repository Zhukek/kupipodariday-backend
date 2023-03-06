import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { alreadyCopiredError, alreadyRaisedError } from 'src/utils/errors';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, user: User): Promise<Record<string, never>> {
    this.wishRepository.save({
      ...dto,
      owner: user,
    });

    return {};
  }

  async getTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 20,
      order: { copied: 'desc' },
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

  async getLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
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

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    if (user.id !== wish.owner.id) {
      throw new ForbiddenException();
    }

    if (wish.raised > 0) {
      throw new BadRequestException(alreadyRaisedError);
    }

    await this.wishRepository.update(id, updateWishDto);
    return {};
  }

  async remove(id: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    if (user.id !== wish.owner.id) {
      throw new ForbiddenException();
    }

    await this.wishRepository.delete(id);
    return wish;
  }

  async copy(id: number, user: User): Promise<Record<string, never>> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(alreadyCopiredError);
    }

    await this.wishRepository.update(id, { copied: (wish.copied += 1) });

    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;
    delete wish.copied;
    delete wish.offers;
    delete wish.raised;

    await this.create(
      {
        ...wish,
      },
      user,
    );

    return {};
  }

  async raisedUpdate(id: number, countRaised: number): Promise<Wish> {
    await this.wishRepository.update(id, { raised: countRaised });

    return this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
  }
}
