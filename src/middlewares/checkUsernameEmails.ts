import {type Request, type Response, type NextFunction} from 'express';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

// check username and email iniqueness
export async function checkUsernameEmails (req: Request, res: Response, next: NextFunction){
    const {userName, emailAdress} = req.body;
    const client = new PrismaClient();
    const userWithSameUsername = await client.user.findUnique({
        where: {
            userName: userName
        }
    });
    if (userWithSameUsername){
        return res.status(400).json({
            message: "Username already in use"
        });
    }
    const userWithSameEmail = await client.user.findUnique({
        where: {
            emailAdress: emailAdress
        }
    });
    if (userWithSameEmail){
        return res.status(400).json({
            message: "Email address already in use"
        });
    }
    next();
}       