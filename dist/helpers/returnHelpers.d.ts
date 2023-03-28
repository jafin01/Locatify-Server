export declare const handleError: (error: any) => {
    success: boolean;
    message: any;
    data: any;
    tokens: any;
    stack: any;
};
export declare const handleSuccess: (message?: string, data?: {}, tokens?: any) => {
    success: boolean;
    message: string;
    data: {};
    tokens: any;
    stack: any;
};
