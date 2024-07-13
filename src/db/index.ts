import { eq } from "drizzle-orm";
import db from "../utils/connection"
import { User, refreshTokens, users } from './schema';
import { hashPassword } from '../utils/authenticationUtilities';
import { createHash } from "../utils/HasherPassword";





export const insertRefreshToken = async (refreshToken: string, user_id: number) => {
    return await db.insert(refreshTokens).values({ user_id: user_id, token: refreshToken }).returning({
        id: refreshTokens.id,
        user: refreshTokens.user_id,
        token: refreshTokens.token
    });

}

export const deleteRefreshToken = async (token: string) => {
    return await db.delete(refreshTokens).where(eq(refreshTokens.token, token))

}

// users -----------------------------

export const getUsers = async () => {
    return await db.select({ id: users.id, email: users.email }).from(users);
}
export const getUser = async (id: number) => {
    return await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.id, id));
}
export const getUserByEmail = async (email: string) => {
    return await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email));
}


export const createUser = async (user: {
    
        email: string;
        password: string;
        salt: string;
        role_id: number;
       
    
}) => {
    return await db.insert(users).values(user).returning({
        id: users.id,
        email: users.email,
        role: users.role_id,
        profile: users.profile_id
    });
}


// forgot password ---------------------------------------------
// reset password
export const updatePassword = async (userId: number, newPassword: string) => {


    const { hashedPassword, salt } = await createHash(newPassword)

    return await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));

};