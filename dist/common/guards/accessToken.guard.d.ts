import { Reflector } from '@nestjs/core';
declare const AccessTokenGuard_base: any;
export declare class AccessTokenGuard extends AccessTokenGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate: (context: ExecutionContext) => any;
}
export {};
