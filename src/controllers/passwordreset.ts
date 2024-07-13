import { getUserByEmail, updatePassword } from '../db';
import { Request, Response } from 'express';
import { generateResetToken, verifyResetToken } from '../utils/authenticationUtilities';
import sendEmail from '../utils/sendMail';




export async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({
            error: "Email not available in schema"
        })
    }

    try {
        const user = await getUserByEmail(email)
        if (!user) return res.status(403).json({
            error: "User Not Found"
        })
        // Generate reset token
        const resetToken = generateResetToken(user[0]?.id);

        // Send reset token to user's email
        await sendEmail(email, resetToken);

        res.status(200).json({ message: `Reset token sent to ${email}` });

    } catch (err) {
        res.status(403).json({
            error: err?.message
        })
    }



}

export async function resetpassword(req:Request, res:Response) {
    const { token, newPassword } = req.body;
    
    // Verify reset token
    const decodedToken = verifyResetToken(token);
    if (!decodedToken) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Update user's password
    const userId = decodedToken.userId;
    const success = await updatePassword(userId, newPassword);
    
    if (success) {
        return res.status(200).json({ message: 'Password updated successfully' });
    } else {
        return res.status(500).json({ message: 'Failed to update password' });
    }
}