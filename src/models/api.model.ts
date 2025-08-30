import { iUser } from "./user.model";


export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    data?: T;
    error?: any;
}

// Define the shape of the login response data
export interface iLoginResponseData {
    user: iUser
    accessToken: string;
    refreshToken: string;
}

export interface iSignupResponse {
    user: iUser
    accessToken: string;
    refreshToken: string;
}

