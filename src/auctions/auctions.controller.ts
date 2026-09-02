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
  Delete,
  Query,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Request } from 'express';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuctionResponseDto } from './dto/auction-response.dto';

@Controller()
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @ApiBody({ type: CreateAuctionDto, description: 'Create a new auction' })
  @ApiConsumes('multipart/form-data')
  @Post('me/auction')
  @UseInterceptors(
    FileInterceptor('image', {
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
  @ApiQuery({ name: 'excludeUserId', required: false, type: Number })
  @ApiResponse({ status: 200, type: [AuctionResponseDto] })
  findAll(@Query('excludeUserId') excludeUserId?: number) {
    return this.auctionsService.findAll(excludeUserId);
  }

  @IsPublic()
  @Get('auctions/:id')
  @ApiResponse({ status: 200, type: AuctionResponseDto })
  findAuction(@Param('id') id: number) {
    return this.auctionsService.findAuction(id);
  }

  @Patch('me/auction/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAuctionDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  updateAuction(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { userId: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuctionDto,
  ) {
    return this.auctionsService.updateAuction(req.user.userId, id, dto, file);
  }

  @Delete('me/auction/:id')
  async removeAuction(
    @Req() req: Request & { user: { userId: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.auctionsService.removeAuction(id);
  }
}
