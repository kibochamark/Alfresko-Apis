import { Request, Response } from 'express';
import { createProfile } from '../db';

export async function createProfileHandler(req: Request, res: Response) {
    const { userType, name, phone, address } = req.body;

    if (!userType || !name || !phone || !address) {
        return res.status(400).json({
            error: "All fields (userType, name, phone, address) are required"
        });
    }

    try {
        const profile = await createProfile(userType, name, phone, address);
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
