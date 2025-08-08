export declare class User {
    id: number;
    email: string;
    password: string;
    hashPassword(): Promise<void>;
}
