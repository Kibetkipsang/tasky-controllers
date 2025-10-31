import {type Request, type Response} from 'express';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient()


// get the user profile
export const getUsersProfile = async (req: Request, res: Response) => {
    try{ 
        const userId = req.user.id;
        const user = await client.user.findUnique({
            where: {
                id: userId
            },
            select: {
                firstName: true,
                lastName: true,
                userName: true,
                emailAdress: true,
                dateJoined: true,
                lastUpdated: true
            }
        })

        if (!user){
            return res.status(404).json({
                message: "user not found"
            })
        }
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}


// update user profile
export const updateUsersProfile = async (req: Request, res: Response) => {
    try{ 
        const userId = req.user.id;
         const {firstName, lastName, userName, emailAdress} = req.body
        const user = await client.user.updateMany({
            where: {
                id: userId,
                isDeleted: false
            },
            data: {
                firstName: firstName && firstName,
                lastName: lastName && lastName,
                userName: userName && userName,
                emailAdress: emailAdress && emailAdress
            
            }
        })

        if (!user){
            return res.status(404).json({
                message: "user not found"
            })
        }
        console.log(user)
        res.status(200).json({
            message: "profile updated successfully"
        })
    }catch(err){
        res.sendStatus(500).json({
            message: "something went wrong"
        })
    }
}
// delete profile
export const deleteUsersProfile = async (req: Request, res: Response) => {
    try{ 
        const userId = req.user.id;
        const user = await client.user.update({
            where: {
                id: userId
            },
            data: {
                isDeleted: true
            }
        
        })
        res.status(200).json({
            message: "Account deleted successfully"
        })
    }catch(err){
        res.sendStatus(500).json({
            message: "something went wrong"
        })
    }
}
