import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class UpdateImageDto extends PickType(UpdateUserDto, [
  'image',
] as const) {}
