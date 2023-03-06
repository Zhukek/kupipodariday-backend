import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { overPriceError, ownerPaymentError } from 'src/utils/errors';
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
    const wish = await this.wishesServise.findById(dto.itemId);

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(ownerPaymentError);
    }

    const countRaised = Number(wish.raised) + Number(dto.amount);

    if (countRaised > wish.price) {
      throw new BadRequestException(overPriceError);
    }

    const wishUpd = await this.wishesServise.raisedUpdate(wish.id, countRaised);

    this.offerRepository.save({
      user: user,
      item: wishUpd,
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
