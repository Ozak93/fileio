 import { Base } from 'shared/entities/base.entity';
 import { Column, Entity,   } from 'typeorm';
import { AccountStatus } from '../enums/account-status.enum';
import { ApiProperty } from '@nestjs/swagger';
   
@Entity()
export class User extends Base {
  @Column({ type: 'varchar', length: 30, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;
 
  @Column({ type: 'varchar' })
  projectName!: string;
  
  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  @ApiProperty({ type: () => AccountStatus })

  accountStatus!: AccountStatus;

 

  
}
