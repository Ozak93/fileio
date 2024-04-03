import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'fs';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'modules/users/users.service';
import { uuid } from 'uuidv4';

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

  async findAll(entityId: string) {
    var res = await this.filesRepository.find({ where: { entityId } });
    if (res.length > 0) {
      var data: any[] = [];
      data = res.map((file: File) => {
        var obj: any = file;
        
        obj.fileExists = existsSync( file.localPath);
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

 async remove(id: string)  {
    let file: File | null =await  this.filesRepository.findOne({ where: {
      id: id,

    } });

    if (file) {
      if (existsSync (file.localPath)) {
        var res = await this.filesRepository.softDelete({ id });
         renameSync(file.localPath, file.localPath.replace(`/${file.projectName}/`, `/trash/`));
        return {
          data: res,
          message: {
            translationKey: 'shared.success.delete',
            args: { entity: 'entities.file' },
          },
          httpStatus: HttpStatus.OK,
        };
      } else {
        return {
          data: {},
          message: {
            translationKey: 'shared.error.notFound',
            args: { entity: 'entities.file' },
          },
          httpStatus: HttpStatus.NOT_FOUND,
        };
      
      }
    } else {
      return {
        data: {},
        message: {
          translationKey: 'shared.error.notFound',
          args: { entity: 'entities.file' },
        },
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }
  }

  async uploadSingleFile(
    body: UploadFileDto,
    userID: string,
    file: Express.Multer.File,
  ) {
    let user = await this.usersService.findOneByID(userID);
    let folderPath =
     
      this.configService.get('FILE_UPLOAD_PATH') +
      '/' +
      user!.projectName +
      '/' +
      body.entityId +
      '/';
    let filePath = folderPath + file.originalname;
    let url =
      this.configService.get('SERVER_FILE_URL') +
      '/files/' +
      user!.projectName +
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



    if (existsSync(filePath) === false) {
      writeFileSync(filePath, file.buffer, { flush: true });

      let fileObj: File = {
        id: uuid(),
        fileName: file.originalname,
        extension: file.originalname.split('.').pop()!,
        projectName: user!.projectName,
        relatedTo: body.relatedTo,
        entityId: body.entityId,
        metaData: body.data,
        localPath: filePath,
        url: url,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        __v: 0,
 
      };
      var queryRes = await this.filesRepository.save(fileObj);

      console.log(`file written`);

      var fetchFile = await this.filesRepository.findOneBy({  id: queryRes.id});
       
    
        var data = JSON.parse(JSON.stringify(fetchFile));
      
       

      return {
        data: data,
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
