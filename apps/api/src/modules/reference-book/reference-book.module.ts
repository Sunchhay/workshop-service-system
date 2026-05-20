import { Module } from '@nestjs/common';

import { ReferenceBookController } from './reference-book.controller';
import { ReferenceBookRepository } from './reference-book.repository';
import { ReferenceBookService } from './reference-book.service';

@Module({
  controllers: [ReferenceBookController],
  providers: [ReferenceBookService, ReferenceBookRepository],
  exports: [ReferenceBookService],
})
export class ReferenceBookModule {}
