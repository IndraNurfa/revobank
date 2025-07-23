import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

@Injectable()
export class RandomNumberGenerator {
  private numericId = customAlphabet('1234567890', 10);

  generateReference(): string {
    const now = this.timestamp();
    const randomNumber = this.numericId(5);
    return `${now}${randomNumber}`;
  }

  generateAccountNumber(): string {
    const base = '10';
    const randomNumber = this.numericId(8);
    return `${base}${randomNumber}`;
  }

  private timestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  }
}
