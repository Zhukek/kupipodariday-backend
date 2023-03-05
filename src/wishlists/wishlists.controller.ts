import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { WishlistInterceptor } from 'src/interceptors/wishlist';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(WishlistInterceptor)
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(WishlistInterceptor)
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: { user: User },
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishlistInterceptor)
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishlistInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: { user: User },
  ): Promise<Wishlist> {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishlistInterceptor)
  remove(
    @Param('id') id: string,
    @Req() req: { user: User },
  ): Promise<Wishlist> {
    return this.wishlistsService.remove(+id, req.user);
  }
}
