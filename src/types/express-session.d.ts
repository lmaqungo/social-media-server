import * as express from 'express'; 

declare global{
    namespace Express {
        interface User extends ValidUser {       
    }
}
}

interface ValidUser {
    id: number; 
    username: string
}