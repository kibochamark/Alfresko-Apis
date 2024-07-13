import express from 'express';
import passport from 'passport';
import { generateTokens, verifyRefreshToken } from '../utils/authenticationUtilities';
import { refreshTokens } from '../db/schema';
import { createUser, deleteRefreshToken, getUser, insertRefreshToken } from '../db';
import { createHash } from '../utils/HasherPassword';
import { Request } from 'express';


// controller to handle user login
export async function loginUser(req: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        passport.authenticate('local', async (err: any, user: any, info: any) => {
            if (err) return next(err);
            if (!user) return response.status(401).json({ message: info.message }).end();
            
            
            const { accessToken, refreshToken } = generateTokens(user[0]);
            await insertRefreshToken(refreshToken, user[0].id)

            response.json({ accessToken, refreshToken });
        })(req, response, next);
    } catch {
        response.status(400).json({
            message: "Something went wrong, Contact administrator"
        }).end()
    }
}

export async function registerUser(req: express.Request, response: express.Response, next: express.NextFunction) {
    const { email, password, role } = req.body;


    if (!email || !password || !role) {
        response.status(500).json({ error: 'Email or password or role is missing in schema' });
    }

    const { hashedPassword, salt } = await createHash(password);


    

    try {
        const user = await createUser({
            email: email,
            password: hashedPassword,
            salt: salt,
            role_id: parseInt(role),
           
        })

        

        response.status(201).json(user).end();
    } catch (err) {
        response.status(500).json({ error: err?.message }).end();
    }
}

export const refreshToken = async (req: express.Request, response: express.Response, next: express.NextFunction) => {
    const { apprefreshToken } = req.body;
    if (!refreshToken) return response.status(403).json({ message: 'Refresh token is required' }).end();

    try {
        const decoded = verifyRefreshToken(apprefreshToken);
        
        const user = await getUser(parseInt(decoded.id));
        if (!user) return response.status(403).json({ message: 'User not found' });



        await deleteRefreshToken(apprefreshToken);
        const { accessToken, refreshToken } = generateTokens({
            id: user[0].id,
            email: user[0].email
        });

        await insertRefreshToken(refreshToken, user[0].id)


        response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken }).end();
    } catch (err) {
        response.status(403).json({ message: err.message }).end();
    }
}
// Google OAuth Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     async (req, res) => {
//         const user = req.user;
//         const accessToken = generateAccessToken(user);
//         const refreshToken = generateRefreshToken(user);

//         await db.insert(refreshTokens).values({ user_id: user.id, token: refreshToken }).returning('*');

//         res.json({ accessToken, refreshToken });
//     }
// );


export async function logoutUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(403).json({ error: "Refresh token not included in schema" }).end()

    await deleteRefreshToken(refreshToken)
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
    return res.status(200).json({ message: "logged out successfully" }).end()

}



