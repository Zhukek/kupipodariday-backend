import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>
  ) {}

  async create(dto: CreateWishDto, user: User): Promise<{}> {
    this.wishRepository.save({
      ...dto,
      owner: user
    });

    return {}
  }

  /* async findAll(): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: ['owner', 'offers']
    })
  } */

  async getTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 20,
      order: {createdAt: "desc"},
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    })
  }

  async getLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: {createdAt: "desc"},
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    })
  }

  async findById(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      where: {id: id},
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ]
    })
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.wishRepository.findOne({
      where: {id: id},
      relations: ['owner']
    })

    if (!wish) {
      throw new NotFoundException()
    }

    if (user.id !== wish.owner.id) {
      throw new ForbiddenException()
    }

    await this.wishRepository.update(id, updateWishDto)
    return {}
  }

  /* 

  remove(id: number) {
    return `This action removes a #${id} wish`;
  } */
}
