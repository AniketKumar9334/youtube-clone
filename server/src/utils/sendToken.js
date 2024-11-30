import { generateAccessAndRefereshTokens } from "../controllers/user.controller.js";


export const sendToken = async (user, statusCode, res, message ="") => {
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );
  
    // options for cookie
    const options = {
      maxAge:  1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    const options2 = {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
  
    res.status(statusCode).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options2).json({
      success: true,
      user,
      refreshToken,
      accessToken,
      message
    });
  };
  
  