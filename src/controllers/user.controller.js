import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import { json } from "express"


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Sommething went wrong while generating refresh and c+access token");
  }
}

const registerUser = asyncHandler(async (req, res) => {

  console.log("BODY:", req.body);
  console.log("FILES:", req.files); // 🔥 THIS IS THE KEY LOG

  const avatarFileArray = req.files?.avatar;
  const coverImageFileArray = req.files?.coverImage;

  const avatarLocalPath =
    Array.isArray(avatarFileArray) && avatarFileArray.length > 0
      ? avatarFileArray[0].path
      : null;

  const coverImageLocalPath =
    Array.isArray(coverImageFileArray) && coverImageFileArray.length > 0
      ? coverImageFileArray[0].path
      : null;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // continue user creation...
});


const loginUser = asyncHandler(async (req, res) => {
  // req body -> data

  // username or email

  // find the user

  // password check

  // access and refresh token

  // send cookie

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentails");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User loggedIn successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout"))
})


const refreshAccessToekn = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie
    .refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid")
    }

    if (incomingRefreshToken !== user?.refreshAccessToekn) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }


    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res.status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
    json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access Token refreshed Successfully"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.message ||
      "Invalid refresh token"
    )
  }
})


const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body


  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword

  await user.save({ validateBeforeSave: false })

  return res.status(200)
    .json(new ApiResponse(
      200, {}, "Password changed successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200)
    .json(200, req.user, "Current user fetched successfully")
})
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  // ❌ At least one field must be provided
  if (!fullName && !email) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required to update",
    });
  }

  // Build update object dynamically
  const updateFields = {};

  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateFields,
    },
    {
      new: true,          // return updated document
      runValidators: true // apply schema validations
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Account details updated successfully",
    user: updatedUser,
  });
});


const getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo "
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1
      }
    }
  ])

  if(!channel?.length) {
    throw new ApiError(404, "Channel does not exist")
  }

  return res.status(200)
  .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
  )
})




export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToekn,
  changeCurrentUserPassword,
  getCurrentUser
}




