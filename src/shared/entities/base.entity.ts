import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { uuid } from 'uuidv4';

export abstract class Base {
  @PrimaryColumn()
  id?: string;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;

  @VersionColumn()
  __v!: number;



  @BeforeInsert()
generateUuid() {
  if (!this.id) {
    this.id = uuid();
  }
}
}
