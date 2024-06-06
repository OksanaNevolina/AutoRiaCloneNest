import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import { PermissionEntity } from '../../../database/entities/permission.entity';
import { PermissionRepository } from '../../repository/services/permission.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { PermissionResponseDto } from '../dto/response/permission.response.dto';
import { PermissionRequestDto } from '../dto/request/permission.request.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";


@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly userRepository: UserRepository,
    @InjectEntityManager()
    private readonly entityManager:EntityManager
  ) {}

  public async create(
    userData: IUserData,
    dto: PermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    return await this.entityManager.transaction(async (em:EntityManager)=>{
      const permissionRepository = em.getRepository(PermissionEntity)
      const permission = await permissionRepository.findOneBy({ name: dto.name });
      if(permission){
        throw new NotFoundException('Permission already exists');
      }
      return await this.permissionRepository.save(
          this.permissionRepository.create(dto),
      );
    })

  }

  public async findAll(): Promise<PermissionEntity[]> {
    return await this.entityManager.transaction(async (em:EntityManager)=>{
      const permissionRepository = em.getRepository(PermissionEntity)
      return await permissionRepository.find();
    })

  }

  async findOneByName(permissionName: string): Promise<PermissionEntity> {
    return await this.entityManager.transaction(async (em:EntityManager)=>{
      const permissionRepository = em.getRepository(PermissionEntity)
      return await permissionRepository.findOneBy({ name: permissionName });
    })


  }

  async deletePermissions(idPermission: string): Promise<void> {
    await this.entityManager.transaction(async (em:EntityManager)=>{
      await this.permissionRepository.delete({ id:idPermission });
    })

  }
  async grantPermission(userId: string, permissionName: string): Promise<void> {
    return await this.entityManager.transaction(async ()=>{
      try {
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.permissions', 'permission')
            .where('user.id = :userId', { userId })
            .getOne();

        if (!user) {
          throw new NotFoundException('User not found');
        }

        const permission = await this.permissionRepository.findOne({ where: { name: permissionName } });
        if (!permission) {
          throw new NotFoundException('Permission not found');
        }

        const existingPermission = user.permissions.find(p => p.name === permissionName);
        if (!existingPermission) {
          user.permissions.push(permission);
          await this.userRepository.save(user);
        }
      } catch (error) {
        throw new Error(`Error granting permission: ${error.message}`);
      }
    })

  }


}
