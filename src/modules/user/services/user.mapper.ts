import { UserEntity } from '../../../database/entities/user.entity';
import { UserResponseDto } from '../dto/response/user.response.dto';

export class UserMapper {
  public static toResponseDto(userEntity: UserEntity): UserResponseDto {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
    };
  }
}
