export interface IUser {
    _id: string;
    username: string;
    email: string;
    displayName: string;
    token: string;
    roles: string[];
}

export interface IUserFormValues {
    email: string;
    password: string;
    roles: string[];
    role?: string;
    displayName?: string;
    username?: string;
}