import  session  from 'express-session';
import  createHttpError  from 'http-errors';
import { RequestHandler } from "express";
import bcrypt from "bcrypt"


import UserModel from "../models/user";

//Check Authen
export const getAuthrnticatedUser : RequestHandler = async (req , res , next) => {

    try {
        const user = await UserModel.findById(req.session.userId) .select("+email").exec();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface signUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown , unknown , signUpBody , unknown> = async(req,res,next) =>{
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    console.log("Parameters : ",username , email , passwordRaw);

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400 , "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({username : username}).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already take. Please choose a different one or log in instead.");
        }
        const existingEmail = await UserModel.findOne({email : email}).exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exist. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        res.status(201).json(newUser);

    } catch (error) {
        console.log("Error");
       next(error) 
    }

}

interface LoginBody{
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown , unknown , LoginBody , unknown> = async(req , res , next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        
        if (!username || !password) {
            throw createHttpError(400 , "Parameters missing");
        }

        const user = await UserModel.findOne({username : username }).select("+password +email").exec();
        console.log("User :" , user);
        if (!user) {
            throw createHttpError(401 , "Invalid credentials")
        }
        const passwordMatch = await bcrypt.compare(password! , user.password!);

        if (!passwordMatch) {
            throw createHttpError(401 , "Invalid credentials");
        }
        //Dùng để thiết lập giá trị của thuộc tính "userId" trong đối tượng "session" của yêu cầu (req)
        req.session.userId = user._id;
        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
}


export const logout: RequestHandler = (req , res , next) =>{
    req.session.destroy(error =>{
        if (error) {
            next(error);
        }else{
            res.sendStatus(200);
        }
    });
} 