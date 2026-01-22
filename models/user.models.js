import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import brycpt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverIamge: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String,
        }

    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = brycpt.hash(this.password, 10)
    next()
    }
)

userSchema.methods.isPasswordCorrect = async function 
(params) {
    return await brycpt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema)