import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {
  private logger = new Logger('CatsService');
  private cats: Cat[] = [
    new Cat(1, 'Whiskers', new Date('2020-01-01'), 'Persian'),
    new Cat(2, 'Milo', new Date('2018-06-24'), 'Siamese'),
  ];
  private nextId = 3;

  create(cat: Omit<Cat, 'id'>): Cat {
    const newCat: Cat = { id: this.nextId++, ...cat };
    const existingCat = this.cats.some((c) => c.name === newCat.name);
    if (existingCat) {
      throw new ConflictException(
        `Cat with name ${newCat.name} already exists`,
      );
    }
    this.cats.push(newCat);
    return newCat;
  }
  findAll(): Cat[] {
    return this.cats;
  }
  findOne(id: number): Cat {
    const cat = this.cats.find((cat) => cat.id === id);
    if (!cat) {
      this.logger.debug(`Cat with id ${id} not found`);
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    return cat;
  }
  update(id: number, update: Partial<Omit<Cat, 'id'>>): Cat {
    const cat = this.findOne(id);
    Object.assign(cat, update);
    return cat;
  }
  remove(id: number): void {
    const removedCat = this.cats.find((cat) => cat.id === id);
    if (!removedCat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    this.cats.splice(this.cats.indexOf(removedCat), 1);
  }

  public calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
