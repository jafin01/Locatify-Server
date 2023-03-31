type JwtPayload = {
    sub: string;
    email: string;
};
declare const AccessTokenStrategy_base: any;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor();
    validate(payload: JwtPayload): JwtPayload;
}
export {};
