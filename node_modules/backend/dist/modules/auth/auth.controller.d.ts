import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        vendorId: string | null;
        createdAt: Date;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
}
