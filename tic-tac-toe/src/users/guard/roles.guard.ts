import { Injectable, CanActivate, ExecutionContext, ConsoleLogger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '../entities/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles: UserRole[] | undefined = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log("roles", !requiredRoles || requiredRoles === undefined);
        if (!requiredRoles || requiredRoles === undefined) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const res = requiredRoles.includes(user.role);
        console.log("roles guard", res);
        return res;
    }
}