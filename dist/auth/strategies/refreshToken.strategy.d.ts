import { Request } from 'express';
import { Strategy } from 'passport-jwt';
declare const refreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class refreshTokenStrategy extends refreshTokenStrategy_base {
    constructor();
    validate(req: Request, payload: any): any;
}
export {};
