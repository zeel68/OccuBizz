// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            accessToken: string
            refreshToken: string
            role: string
            storeId: string
            phoneNumber: string
            email?: string
            name?: string
            image?: string
        } & DefaultSession["user"]
        error?: string
    }

    interface User extends DefaultUser {
        id: string
        accessToken: string
        refreshToken: string
        role: string
        storeId: string
        phoneNumber: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string
        accessToken: string
        refreshToken: string
        role: string
        storeId: string
        phoneNumber: string
        email?: string
        name?: string
        accessTokenExpires: number
        error?: string
    }
}
