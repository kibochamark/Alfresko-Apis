import { eq } from "drizzle-orm";
import db from "../utils/connection"
import { InsertPermission, InsertRole, User, permissions, profiles, refreshTokens, rolePermissions, roles, users } from './schema';
import { hashPassword } from '../utils/authenticationUtilities';
import { createHash } from "../utils/HasherPassword";




// tokens  ----------------------------------------------
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
    return await db.select({ id: users.id, email: users.email, role:users.role_id }).from(users).where(eq(users.id, id));
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
export const updateUser = async (user: {
    
        email?: string;
        password?: string;
        salt?: string;
        role_id?: number;
        profile_id?:number;
       
    
}, id:number) => {
    return await db.update(users).set(user).where(eq(users.id, id)).returning({
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




// profile -----------------------------------------------
export const createProfile = async (userType: string, name: string, phone: string, address: string) => {
    return await db.insert(profiles).values({
        user_type: userType,
        name: name,
        phone: phone,
        address: address,
        created_at: new Date(),
        updated_at: new Date()
    }).returning({
        id: profiles.id,
        user_type: profiles.user_type,
        name: profiles.name,
        phone: profiles.phone,
        address: profiles.address,
        created_at: profiles.created_at,
        updated_at: profiles.updated_at
    });
};

//Update profile 
export const updateProfile = async (profileId: number, updates: any) => {
    return await db.update(profiles).set(updates).where(eq(profiles.id, profileId)).returning({
        id: profiles.id,
        user_type: profiles.user_type,
        name: profiles.name,
        phone: profiles.phone,
        address: profiles.address,
        created_at: profiles.created_at,
        updated_at: profiles.updated_at
    });
};
//Delete Profile
export const deleteProfile = async (profileId: number) => {
    return await db.delete(profiles).where(eq(profiles.id, profileId)).returning({
        id: profiles.id,
        user_type: profiles.user_type,
        name: profiles.name,
        phone: profiles.phone,
        address: profiles.address,
        created_at: profiles.created_at,
        updated_at: profiles.updated_at
    });
};
export const nullifyProfileInUsers = async (profileId: number) => {
    return await db.update(users).set({ profile_id: null }).where(eq(users.profile_id, profileId));
};
//Get Users with profile
export const getUsersWithProfiles = async () => {
    return await db
        .select({
            id: users.id,
            email: users.email,
            profile: {
                id: profiles.id,
                user_type: profiles.user_type,
                name: profiles.name,
                phone: profiles.phone,
                address: profiles.address,
                created_at: profiles.created_at,
                updated_at: profiles.updated_at
            }
        })
        .from(users)
        .leftJoin(profiles, eq(users.profile_id, profiles.id));
};
//Get a single user
export const getUserWithProfile = async (userId: number) => {
    return await db
        .select({
            id: users.id,
            email: users.email,
            profile: {
                id: profiles.id,
                user_type: profiles.user_type,
                name: profiles.name,
                phone: profiles.phone,
                address: profiles.address,
                created_at: profiles.created_at,
                updated_at: profiles.updated_at
            }
        })
        .from(users)
        .leftJoin(profiles, eq(users.profile_id, profiles.id))
        .where(eq(users.id, userId));
};
// Permissions

export const createpermission = async(perm:InsertPermission)=>{
    return await db.insert(permissions).values(perm).returning({
        id:permissions.id,
        name:permissions.name,
        description:permissions.description
    })
}
export const updatepermission = async(perm:InsertPermission, id:number)=>{
    return await db.update(permissions).set(perm).where(eq(permissions.id, id)).returning({
        id:permissions.id,
        name:permissions.name,
        description:permissions.description
    })
}

export const getpermission = async(id:number)=>{
    return await db.select().from(permissions).where(eq(permissions.id, id))
}
export const deletepermission = async(id:number)=>{
    return await db.delete(permissions).where(eq(permissions.id, id))
}
//Delete User
export const deleteUser = async (userId: number) => {
    return await db.delete(users).where(eq(users.id, userId));
};
//delete refresh token to allow you to delete a user
export const deleteRefreshTokensByUserId = async (userId: number) => {
    return await db.delete(refreshTokens).where(eq(refreshTokens.user_id, userId));
};



// roles
export const createrole = async(role:InsertRole)=>{
    return await db.insert(roles).values(role).returning({
        id:roles.id,
        name:roles.name,
        description:roles.description
    })
}
export const updaterole = async(role:InsertRole, id:number)=>{
    return await db.update(roles).set(role). where(eq(roles.id, id)).returning({
        id:roles.id,
        name:roles.name,
        description:roles.description
    })
}

export const getrole = async(id:number)=>{
    return await db.select().from(roles).where(eq(roles.id, id))
}
export const getroles = async()=>{
    return await db.select().from(roles)
}
export const deleterole = async(id:number)=>{
    return await db.delete(roles).where(eq(roles.id, id))
}


// role and permissions

/**
 * Assign one or more permissions to a role
 * @param roleId - The ID of the role
 * @param permissionIds - Array of permission IDs
 */
export async function assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
    const values = permissionIds.map(permissionId => ({
        role_id: roleId,
        permission_id: permissionId,
        created_at: new Date(),
        updated_at: new Date()
    }));

    await db.insert(rolePermissions).values(values).onConflictDoNothing();
}




