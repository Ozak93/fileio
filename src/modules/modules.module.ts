import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
 

@Module({
  imports: [UsersModule, AuthModule, FilesModule],
})
export class ModulesModule {}
