import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { Wish } from './entities/wish.entity';
import { WishInterceptor } from 'src/interceptors/wish';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createWish(
    @Body() createWishDto: CreateWishDto,
    @Req() req: { user: User },
  ): Promise<Record<string, never>> {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('/last')
  @UseInterceptors(WishInterceptor)
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getLast();
  }

  @Get('/top')
  @UseInterceptors(WishInterceptor)
  async getTopWishes(): Promise<Wish[]> {
    return this.wishesService.getTop();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishInterceptor)
  async findWish(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async upadteWish(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: { user: User },
  ): Promise<Record<string, never>> {
    return this.wishesService.updateWish(+id, updateWishDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishInterceptor)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: User },
  ): Promise<Wish> {
    return this.wishesService.remove(+id, req.user);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(
    @Req() req: { user: User },
    @Param('id') id: string,
  ): Promise<Record<string, never>> {
    return this.wishesService.copy(+id, req.user);
  }
}
