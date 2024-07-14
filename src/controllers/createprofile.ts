import { Request, Response } from 'express';
import { createProfile, updateUser } from '../db';
import { getPayloadFromToken } from '../utils/authenticationUtilities';

export async function createProfileHandler(req: Request, res: Response) {
    const { userType, name, phone, address } = req.body;
    const authHeader = req.headers.authorization;
    const payload= getPayloadFromToken(authHeader)


    if (!userType || !name || !phone || !address) {
        return res.status(400).json({
            error: "All fields (userType, name, phone, address) are required"
        });
    }

    try {
        const profile = await createProfile(userType, name, phone, address);
        await updateUser({profile_id:profile[0].id}, payload?.id)
        res.status(201).json({
            message: "Profile created successfully",
            profile: profile[0]
        });
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create profile"
        });
    }
}
