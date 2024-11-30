import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { generateAccessAndRefereshTokens } from "../controllers/user.controller.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const [, payloadBase64] = accessToken.split(".");

    // Decode the payload (Base64 URL Decode)
    const payload = JSON.parse(atob(payloadBase64));

    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    if (accessToken && payload.exp > currentTime) {
        // return next(new ErrorHandler(400, "Token are expired or invlaid"));
        const accessTokenDecoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN
        );

        const user = await User.findById(accessTokenDecoded._id);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        req.user = user;
    } else {
        if (!refreshToken) {
            return next(new ApiError(400, "No refresh token provided"));
        }

        const refreshTokenDecoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN
        );

        const user = await User.findById(refreshTokenDecoded._id);

        if (!user) {
            return next(new ApiError(404, "This token are not valid"));
        }


        const {accessNewToken, refreshNewToken} = await generateAccessAndRefereshTokens(user._id);
        
        const options = {
            maxAge:  1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          };
      
          const options2 = {
            maxAge: 10 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          }

        res.cookie("accessToken", accessNewToken, options);
        res.cookie("refreshToken", refreshNewToken, options2);

        req.user = user
    }

    next();
});
