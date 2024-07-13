import express from "express"
import cors from "cors"
import compression from "compression"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import session from 'express-session';
import passport from 'passport';

import http from "http"
import routes from "./router"
import dotenv from "dotenv"
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './utils/connection'
import { checkPassword } from './utils/HasherPassword';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from "./db"

dotenv.config()

const app = express(

)

app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials:true}));
app.use(compression());
app.use(cookieParser());




app.use("/api/v1",routes)

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    console.log(email)
    try {
        console.log(email)
        const user = await db.select({ password: users.password, id:users.id, email:users.email }).from(users).where(eq(users.email, email));
        console.log(user)
        if (!user) return done(null, false, { message: 'Incorrect email.' });
        const isValid = await checkPassword(password, user[0].password)
        if (!isValid) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: "/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        let user = await db.select().from(users).where(eq(users.email, profile.emails[0].value));
        if (!user) {
            let newUser = await db.insert(users).values({
                email: profile.emails[0].value,
                profile_id: null,
                role_id: 2,
                password: '',
                salt: ''
            }).returning({
                id: users.id,
                email: users.email,
                profile: users.profile_id,
                created_at: users.created_at,
                updated_at: users.updated_at

            });
            return done(null, newUser[0]);
        }

    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user:{id:number}, done) => {
    done(null, user?.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await getUser(id); // Assuming this function correctly retrieves user details by ID
        done(null, user); // Pass retrieved user object to done callback
    } catch (err) {
        done(err); // Handle error if user retrieval fails
    }
});






// const server =http.createServer(app)

// server.listen(process.env.PORT || 8000, () => {
//     console.log(`Server is running on port ${process.env.PORT || 8000}`)
// })


app.listen(8000, ()=>{
    console.log(`Server is running on port 8000`)
})


export default app