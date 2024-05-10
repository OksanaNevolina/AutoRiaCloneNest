import { UserResponseDto } from "../dto/response/user.response.dto";
import { UserEntity } from "../../../database/entities/user.entity";

export class UserMapper {
  public static toResponseDto(userEntity: UserEntity): UserResponseDto {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      role: userEntity.role,
    };
  }
}
