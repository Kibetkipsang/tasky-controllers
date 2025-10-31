import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken'


interface User {
    id: string;
    firstName: string;
    lastName: string;
    emailAdress: string;
    userName: string
}

export function verifyToken(req: Request, res: Response, next: NextFunction){
        const {authToken} = req.cookies;
        if (!authToken){
            res.status(401).json({
                message: "Unauthorised, please log in"
            });
            return;
        }
        try{
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY!)
            req.user = decoded as  User;
            console.log(decoded)
            next()
        }catch(err){
            res.status(500).json({
                message: "unauthorised. please log in"
            })
        }
   
}