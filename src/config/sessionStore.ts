import { prisma } from "../lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from 'express-session'

const session =  expressSession({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    }, 
    secret: 'cats', 
    resave: true, 
    saveUninitialized: true, 
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