import { Base } from 'shared/entities/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { uuid } from 'uuidv4';

@Entity()
export class File extends Base {
  @Column({ type: 'varchar', length: 320 })
  fileName!: string;

  @Column({ type: 'varchar' })
  extension!: string;

  @Column({ type: 'varchar' })
  url!: string;


  @Column({ type: 'varchar' })
  localPath!: string;

  @Column({ type: 'varchar' })
  projectName!: string;

  @Column({ type: 'text' })
  relatedTo!: string;

  @Column({ type: 'text' , })
  entityId!: string;

  @Column({ type: 'json', nullable: true })
  metaData?: any;

 
}
