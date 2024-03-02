import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseUUIDPipe,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { UserID } from 'core/decorators/user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ROUTES } from 'shared/constants/routes.constant';

@ApiTags(ROUTES.FILES.CONTROLLER)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('single/:fileId')
  findOne(@Param('fileId', ParseUUIDPipe) id: string) {
    return this.filesService.findOne(id);
  }

  @Get('many/:entityId')
  findMany(@Param('entityId') id: string) {
    return this.filesService.findAll(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: UploadFileDto,
    @UserID() userID: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000000,
            message(maxSize) {
              return `File size should not be greater than ${maxSize / 1000}MB`;
            },
          }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(
      `file dto ${JSON.stringify(body)} by user ${userID} and file is ${JSON.stringify(file.size)}`,
    );
    return this.filesService.uploadSingleFile(body, userID, file);
  }

  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files', 10, { preservePath: true, }))
  uploadFiles(
    @Body() body: UploadFileDto,
    @UserID() userID: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000000,
            message(maxSize) {
              return `File size should not be greater than ${maxSize / 1000}MB`;
            },
          }),
          // new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    console.log(
      `file dto ${JSON.stringify(body)} by user ${userID} and file is ${JSON.stringify(files.length)}`,
    );
    return this.filesService.uploadMultipleFiles(body, userID, files);
  }
}
