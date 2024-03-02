import {
  Controller,
} from '@nestjs/common';
 import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { ROUTES } from 'shared/constants/routes.constant';

@ApiTags(ROUTES.USERS.CONTROLLER)
@Controller(ROUTES.USERS.CONTROLLER)
export class UsersController {
  //constructor(private readonly usersService: UsersService) {}

  // @Get(ROUTES.USERS.FIND_ALL)
  // findAll(
  //   @Query() filterUsersDto: FilterUsersDto,
  // ): Promise<ResponseFromServiceI<User[]>> {
  //   return this.usersService.findAll(filterUsersDto);
  // }

  // @Get(ROUTES.USERS.FIND_ONE)
  // findOne(@Param('userID', new ParseUUIDPipe()) userID: string) {
  //   return this.usersService.findOne(userID);
  // }

  // @Patch(ROUTES.USERS.UPDATE_ONE)
  // update(@UserID() userID: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(userID, updateUserDto);
  // }

  // @Delete(ROUTES.USERS.DELETE_ONE)
  // remove(@UserID() userID: string) {
  //   return this.usersService.remove(userID);
  // }
 
}
