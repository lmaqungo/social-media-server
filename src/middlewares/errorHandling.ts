import { type ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error'; 
    err.message = err.message || 'Something went wrong'; 

    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status, 
            message: err.message
        })
    }

    else {
        console.error('UNEXPECTED ERROR', err)

        res.status(500).json({
            status: 'error', 
            message: 'Internal server error. Something broke on our side'
        })
    }
} 

export default errorHandler

// errors appear ambiguous because they're intended for the user, not developer