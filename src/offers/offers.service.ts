import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesServise: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User) {
    const wish = await this.wishesServise.raisedUpdate(
      dto.itemId,
      dto.amount,
      user,
    );

    this.offerRepository.save({
      user: user,
      item: wish,
      ...dto,
    });
    return {};
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['item', 'user', 'item.owner'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: ['item', 'user', 'item.owner'],
    });

    if (!offer) {
      throw new NotFoundException();
    }

    return offer;
  }
}
