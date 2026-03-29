import { prisma } from "../lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from 'express-session'
import "dotenv/config";

const { NODE_ENV } = process.env


const session =  expressSession({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        secure: true, 
        sameSite: NODE_ENV === 'prod' ?  'none' : false
    }, 
    secret: 'cats', 
    resave: false, 
    saveUninitialized: false, 
    store: new PrismaSessionStore(
        prisma, 
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
})

export default session