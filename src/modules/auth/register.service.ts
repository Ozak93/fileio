import {  HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { User } from 'modules/users/entities/user.entity';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'modules/users/users.service';
@Injectable()
export class RegisterService {
  constructor(private  usersService:UsersService) {}
  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<ResponseFromServiceI<User>> {
    const { password } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    createUserDto.password = hashedPassword;

    const createdUser =
      await this.usersService.createUserForAuth(createUserDto);

    return {
      httpStatus: HttpStatus.CREATED,
      message: {
        translationKey: 'shared.success.create',
        args: { entity: 'entities.user' },
      },
      data: createdUser,
    };
  }
}
