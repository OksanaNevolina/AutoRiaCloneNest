import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

import { IUserData } from "../interfaces/user-data.interface";
import { RoleEnum } from "../../../database/enums/role-enum";
import {UserEntity} from "../../../database/entities/user.entity";

@Injectable()
export class ManagerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user:UserEntity = request.user;

        return user.role === RoleEnum.MANAGER;
    }
}