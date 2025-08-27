export declare function registerUserSvc(input: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
}): Promise<{
    regToken: string;
}>;
export declare function verifyOtpSvc(input: {
    regToken?: string;
    otp?: number;
}): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
}>;
//# sourceMappingURL=authService.d.ts.map