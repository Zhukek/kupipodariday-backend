import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, NotFoundException } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { Wish } from './entities/wish.entity';
import { WishOwnerInterceptor } from 'src/interceptors/wishOwner';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createWish(@Body() createWishDto: CreateWishDto, @Req() req: {user: User}): Promise<{}> {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('/last')
  @UseInterceptors(WishOwnerInterceptor)
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getLast()
  }

  @Get('/top')
  @UseInterceptors(WishOwnerInterceptor)
  async getTopWishes(): Promise<Wish[]> {
    return this.wishesService.getTop()
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishOwnerInterceptor)
  async findWish(@Param('id') id: string): Promise<Wish> {
    const wish = await this.wishesService.findById(+id);

    if(!wish) {
      throw new NotFoundException()
    }

    return wish
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async upadteWish(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto, @Req() req: {user: User}): Promise<{}> {
    return this.wishesService.updateWish(+id, updateWishDto, req.user);
  }

  /* @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(+id);
  } */
}
