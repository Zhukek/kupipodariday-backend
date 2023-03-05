import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesServise: WishesService,
  ) {}

  findAll() {
    return this.wishlistRepository.find({
      relations: ['items', 'user'],
    });
  }

  async create(dto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const items: Wish[] = await Promise.all(
      dto.itemsId.map((itemId) => this.wishesServise.findById(+itemId)),
    );

    delete dto.itemsId;

    return this.wishlistRepository.save({
      ...dto,
      items: items,
      user: user,
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['items', 'user'],
    });

    if (!wishlist) {
      throw new NotFoundException();
    }

    return wishlist;
  }

  async update(
    id: number,
    dto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.user.id !== user.id) {
      throw new ForbiddenException();
    }

    const items: Wish[] = await Promise.all(
      dto.itemsId.map((itemId) => this.wishesServise.findById(+itemId)),
    );

    delete dto.itemsId;

    return this.wishlistRepository.save({
      ...wishlist,
      ...dto,
      items: items,
    });
  }

  async remove(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.user.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.wishlistRepository.delete(id);
    return wishlist;
  }
}
