import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './DTOs/create-cat.dto';
import { UpdateCatDto } from './DTOs/update-cat.dto';

@Controller({ version: '1', path: 'cats' })
export class CatsController {
  private logger = new Logger('CatsController');
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() CreateCatDto: CreateCatDto) {
    this.logger.verbose(
      `Cats ${CreateCatDto.name} creating a new task. Data: ${JSON.stringify(CreateCatDto)}`,
    );
    return this.catsService.create({
      ...CreateCatDto,
      birthdate: new Date(CreateCatDto.birthdate),
    });
  }

  @Get()
  findAll() {
    this.logger.verbose(`Get all cats`);
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catsService.update(id, {
      ...updateCatDto,
      birthdate: updateCatDto.birthdate
        ? new Date(updateCatDto.birthdate)
        : undefined,
    });
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    this.catsService.remove(id);
    return { message: `Cat with id ${id} has been removed.` };
  }

  @Get(':id/age')
  getAge(@Param('id') id: number) {
    const cat = this.catsService.findOne(id);
    const age = this.catsService.calculateAge(cat.birthdate);
    return `Cat with id ${id} and name ${cat.name} is ${age} years old.`;
  }
}
