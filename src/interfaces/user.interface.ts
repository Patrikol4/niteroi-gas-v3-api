export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreate {
    id: string,
    email: string,
    name: string,
    telephone: string,
    password: string,
}

export interface UserLogin {
    id: string,
    email: string,
    name: string,
    password: string,
}

export interface UserRepo {
    create(data: UserCreate): Promise<User>
    login(data: UserLogin): Promise<User>
    findByEmail(email: string): Promise<User | null>;
}