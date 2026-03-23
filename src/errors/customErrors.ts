class AppError extends Error {
    statusCode; 
    status; 
    isOperational; 

    constructor(statusCode: number, message: string, isOperational=true) {
        super(message); 
        this.statusCode = statusCode; 
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 
        this.isOperational = isOperational; 

        Error.captureStackTrace(this, this.constructor)
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(404, message)
    }
}

class ValidationError extends AppError {
    constructor(message = "Invalid input data") {
        super(400, message)
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Not authorized") {
        super(401, message)
    }
}

export {
    NotFoundError, 
    ValidationError, 
    UnauthorizedError 
}