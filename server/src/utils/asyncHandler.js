import { envMode } from "../index.js";

const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  }


export { asyncHandler }


export const errorMiddleware = (err, req, res, next)=> {

    err.message||= "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
    const response = {
      success: false,
      message: err.message,
    };
  
    if (envMode === "DEVELOPMENT") {
      response.error = err;
    }
  
    return res.status(err.statusCode).json(response);
  
  };
  