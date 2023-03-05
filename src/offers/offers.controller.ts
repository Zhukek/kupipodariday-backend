import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { User } from 'src/users/entities/user.entity';
import { OfferInterceptor } from 'src/interceptors/offer';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: { user: User },
  ): Promise<Record<string, never>> {
    return this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(OfferInterceptor)
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(OfferInterceptor)
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
