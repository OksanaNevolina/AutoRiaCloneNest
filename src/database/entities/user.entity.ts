import { Column, Entity, OneToMany } from 'typeorm';
import { TableNameEnum } from '../enums/table-name.enum';
import { BaseEntity } from './models/base.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { AccountTypeEnum } from '../enums/account-type.enum';
import { RoleEnum } from '../enums/role-enum';

@Entity(TableNameEnum.USERS)
export class UserEntity extends BaseEntity {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('boolean', { default: true })
  status: boolean;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    default: AccountTypeEnum.BASE,
  })
  accountType: AccountTypeEnum;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.SELLER,
  })
  role: RoleEnum;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
