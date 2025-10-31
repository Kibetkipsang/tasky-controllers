import {type Request, type Response, type NextFunction} from 'express';

// checking registration details
export function checkDetails (req: Request, res: Response, next: NextFunction){
    if (!req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.emailAdress || !req.body.password){
        return res.status(400).json({
            message: "All fields are required!"
        })
    }
    next();
}