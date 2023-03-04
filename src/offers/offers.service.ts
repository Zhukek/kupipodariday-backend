import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor (
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesServise: WishesService
  ) {}

  async create(dto: CreateOfferDto, user: User) {

    const wish = await this.wishesServise.raisedUpdate(dto.itemId, dto.amount, user);

    console.log(wish)

    const offer = await this.offerRepository.create({
      user: user,
      item: wish,
      ...dto
    })

    this.offerRepository.save(offer)
    return {}
  }

  /* 

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  } */
}
