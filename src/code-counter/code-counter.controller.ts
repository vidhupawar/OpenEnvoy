import {
  Controller,
  Post,
  Param,
  Res,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CodeCounterService } from './code-counter.service';

@Controller('code-counter')
export class CodeCounterController {
  constructor(private readonly codeCounterService: CodeCounterService) {}

  @Post('count')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No File' });
    }
    const data = await this.codeCounterService.countLines(file);
    return res.status(HttpStatus.CREATED).json({
      message: 'File processed',
      data,
    });
  }

  @Post('count-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    if (!files || files.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No Files' });
    }
    const totals = await this.codeCounterService.countMultipleFiles(files);
    return res.status(HttpStatus.OK).json({
      message: 'Files processed',
      totals,
    });
  }
}
