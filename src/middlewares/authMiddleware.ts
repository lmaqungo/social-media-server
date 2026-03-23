import { type RequestHandler } from "express";
import { UnauthorizedError } from "../errors/customErrors.js";


const isAuth: RequestHandler = (req, res, next) =>  {
    if (req.isAuthenticated()) {
        next()
    } else{
        throw new UnauthorizedError()
    }
}

export default isAuth