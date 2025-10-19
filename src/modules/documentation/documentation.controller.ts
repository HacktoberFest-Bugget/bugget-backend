import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import type { Response } from 'express';
import { AuthGuard } from '../guards/app.guard';

@UseGuards(AuthGuard)
@Controller('documentation')
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  @Post()
  async create(@Body() createDocumentationDto: CreateDocumentationDto) {
    return await this.documentationService.create(createDocumentationDto);
  }

  @Get()
  async findAll() {
    return await this.documentationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const file = await this.documentationService.findOne(id);

    const buffer = Buffer.from(file.content, 'utf8');

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );

    res.send(buffer);
  }
}
