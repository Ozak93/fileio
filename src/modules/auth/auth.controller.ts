import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { Public } from 'core/decorators/public.decorator';
import { UserID } from 'core/decorators/user-id.decorator';
 import { ROUTES } from 'shared/constants/routes.constant';
import { LogUserInDto } from './dto/log-user-in.dto';
import { LoginService } from './login.service';
import { LogoutService } from './logout.service';
import { registerRouteApiResponse } from './constants/register-route-api-response.conatant';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { RegisterService } from './register.service';

@ApiTags(ROUTES.AUTH.CONTROLLER)
@Controller(ROUTES.AUTH.CONTROLLER)
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
   private readonly registerService: RegisterService,
    private readonly logoutService: LogoutService,
  ) {}

  @Public()
  @ApiResponse(registerRouteApiResponse)
  @Post(ROUTES.AUTH.REGISTER_USER)
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.registerService.registerUser(createUserDto);
  }

  @Public()
  @Post(ROUTES.AUTH.LOG_USER_IN)
  logUserIn(@Body() logUserInDto: LogUserInDto) {
    return this.loginService.logUserIn(logUserInDto);
  }

  @Post(ROUTES.AUTH.LOG_OUT)
  logUserOut(@UserID() userID: string) {
    return this.logoutService.logUserOut(userID);
  }
}
