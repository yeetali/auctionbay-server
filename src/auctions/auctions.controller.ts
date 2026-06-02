import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Patch,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Request } from 'express';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller()
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @ApiBody({ type: CreateAuctionDto, description: 'Create a new auction' })
  @ApiConsumes('multipart/form-data')
  @Post('me/auction')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createAuction(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { userId: number } },
    @Body() createAuctionDto: CreateAuctionDto,
  ) {
    return await this.auctionsService.create(
      req.user.userId,
      createAuctionDto,
      file,
    );
  }

  @IsPublic()
  @Get('auctions')
  findAll() {
    return this.auctionsService.findAll();
  }

  @Patch('me/auction/:id')
  @UseInterceptors(FileInterceptor('media'))
  updateAuction(
    @Req() req: Request & { user: { userId: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuctionDto,
  ) {
    return this.auctionsService.updateAuction(req.user.userId, id, dto);
  }
}
