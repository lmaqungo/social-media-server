import * as express from 'express'; 

declare global{
    namespace Express {
        interface User extends ValidUser {}
        interface Request {
            user: User
        }
}
}

interface ValidUser {
    id: number
    username: string
}