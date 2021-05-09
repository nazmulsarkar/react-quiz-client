export interface IUser {
    id: string;
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
    displayName?: string;
    username?: string;
}