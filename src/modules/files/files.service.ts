import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file' + createFileDto;
  }

  async findAll(relatedTo: string) {
    var res = await this.filesRepository.find({ where: { relatedTo } });
    if (res.length > 0) {
      var data: any[] = [];
      data = res.map((file: File) => {
        var obj: any = file;
        obj.url= this.configService.get('SERVER_FILE_URL') + file.url;
        obj.valid = existsSync('./' + file.url);
        return obj;
      });
      return {
        data: data,
        message: {
          translationKey: 'shared.success.found',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.OK,
      };
    } else {
      return {
        data: [],
        message: {
          translationKey: 'shared.error.notFound',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }
  }

  async findOne(id: string) {
    var res = await this.filesRepository.findOneBy({ id });
    console.log(`file found ${JSON.stringify(res)}`);
    if (res) {
      var data = JSON.parse(JSON.stringify(res));
      data.valid = existsSync('./' + res.url);
      data.url= this.configService.get('SERVER_FILE_URL') + data.url;
      return {
        data: data,
        message: {
          translationKey: 'shared.success.found',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.OK,
      };
    } else
      return {
        data: {},
        message: {
          translationKey: 'shared.error.notFound',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.NOT_FOUND,
      };
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${updateFileDto} file` + id;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  async uploadSingleFile(
    body: UploadFileDto,
    userID: string,
    file: Express.Multer.File,
  ) {
    let folderPath =
      './' +
      this.configService.get('FILE_UPLOAD_PATH') +
      '/' +
      body.entityId +
      '/';
    let filePath = folderPath + file.originalname;
    let url =
      '/' +
      this.configService.get('FILE_UPLOAD_PATH') +
      '/' +
      body.entityId +
      '/' +
      file.originalname;
    console.log(`userID is ${userID}`);
    console.log(`file exist? ${existsSync(filePath)}`);
    console.log(`folder path ${existsSync(folderPath)}`);
    console.log(`folder path ${folderPath}`);
    let res = mkdirSync(folderPath, { recursive: true });
    console.log(`folder created? ${res}`);

    let user = await this.usersService.findOneByID(userID);

    if (existsSync(filePath) === false) {
      writeFileSync(filePath, file.buffer, { flush: true });

      let fileObj: File = {
        fileName: file.originalname,
        extension: file.originalname.split('.').pop()!,
        projectName: user!.projectName,
        relatedTo: body.relatedTo,
        entityId: body.entityId,
        metaData: body.data,
        url: url,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        __v: 0,
      };
      var queryRes = await this.filesRepository.save(fileObj);

      console.log(`file written`);

      return {
        data: { id: queryRes.id, url: queryRes.url },
        message: {
          translationKey: 'shared.success.create',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.CREATED,
      };
    } else {
      let file: File | null = await this.filesRepository.findOne({
        where: {
          url: url,
        },
      });
      console.log(`searched file is ${JSON.stringify(file)}`);

      return {
        data: {
          id: file?.id,
          url: file?.url,
          fileName: file?.fileName,
          relatedTo: file?.relatedTo,
        },
        message: {
          translationKey: 'shared.error.exists',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.CONFLICT,
      };
    }
  }

  async uploadMultipleFiles(
    body: UploadFileDto,
    userID: string,
    file: Array<Express.Multer.File>,
  ) {
    var resArr = await Promise.all(
      file.map(async (filei) => this.uploadSingleFile(body, userID, filei)),
    );
    console.log(`resArr is ${JSON.stringify(resArr)}`);
    if (resArr.every((res) => res != null)) {
      return {
        data: resArr,
        message: {
          translationKey: 'shared.success.create',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.CREATED,
      };
    } else {
      return {
        data: resArr,
        message: {
          translationKey: 'shared.error.exists',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.BAD_GATEWAY,
      };
    }
  }
}
