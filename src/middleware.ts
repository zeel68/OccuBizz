import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROLE_ID, CUSTOMER_ROLE_ID, OWNER_ROLE_ID } from "@/data/Consts";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // Not authenticated and trying to access a protected page
    if (!session?.user && !isAuthPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Authenticated and trying to access login/signup
    if (session?.user && isAuthPage) {
        const { role } = session.user;

        if (role === OWNER_ROLE_ID ) {
            return NextResponse.redirect(new URL("/", request.url));
        } else if (role === ADMIN_ROLE_ID) {
            return  NextResponse.redirect(new URL("/Admin", request.url));
        } else {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }


        // Optional: handle unknown roles if needed
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // prevent owner to access the admin pages
    if(pathname === "/Admin" && session?.user.role === OWNER_ROLE_ID) {
        console.log("Non Admin")
        return NextResponse.redirect(new URL("/unauthorized", request.url));

    }
    // Authenticated and accessing a protected page
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/Admin/:path*", "/login", "/signup"],
};
