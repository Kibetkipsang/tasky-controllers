import { PrismaClient } from '@prisma/client';
import express, {type Request, type Response} from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const client = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try{
        const {firstName, lastName, userName, emailAdress, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await client.user.create({
            data: {
                firstName,
                lastName,
                userName,
                emailAdress,
                password: hashedPassword
            }
        });
        res.status(201).json({
            message: "User created successfully"
        });
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const login = async (req: Request, res: Response)=> {
    try{
        const { identifier, password} = req.body

        // get user whose email or user name matches the identifier
        const user = await client.user.findFirst({
            where:{
                OR: [{emailAdress: identifier}, {userName: identifier}]
            }
        })
        // check if credentials are available
        if(!user){
            return res.status(400).json({
                message: "Wrong login credentials"
            });
        }
        // compare pasword to the hashed password
        const isLegit = await bcrypt.compare(password, user.password);
        if (!isLegit){
            return res.status(400).json({
                message: "Wrong login credentials"
            });
        }
        // specify the payload to be sent to hide sensitive info
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            emailAdress: user.emailAdress
        }

        // generate token and save it to a cookie
        const token = jwt.sign(user, process.env.JWT_SECRET_KEY!, {expiresIn: '2hrs'});
        res.status(200).cookie("authToken", token).json(payload)
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const logout = async (req: Request, res: Response)=> {
    try{
        res.clearCookie("authToken").status(200).json({
            message: "logged out successfully"
        })
    }catch(e){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

// changing password
export const changePassword = async (req: Request, res: Response) => {
    try{
        // get previous password and the new password
        const {previousPassword, password} = req.body;
        const userId = req.user.id;
        const user = await client.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            return res.status(404).json({
                message: "user not found"
            })  
        }
        const passMatch = await bcrypt.compare(previousPassword, user?.password);
        if(!passMatch){
            return res.status(400).json({
                message: "wrong password"
            })
        }

        const newPassword = await bcrypt.hash(password, 10);
        await client.user.update({
           where: {
            id: userId
           },
           data: {
            password: newPassword
           }
        })
        // compare the stored password with previous pass
        // if they dont match - err
        // if they match hash new password and update the record
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}