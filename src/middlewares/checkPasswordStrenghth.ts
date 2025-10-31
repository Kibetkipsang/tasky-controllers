import {type Request, type Response, type NextFunction} from 'express';
import zxcvbn from 'zxcvbn';


// checking passwords strength
export function checkPassStrength(req: Request, res: Response, next: NextFunction){
    const password = req.body.password;
    const result = zxcvbn(password);
    const score = result.score;
    if(score < 3){
        return res.status(400).json({
            message: "Password is too weak"
        })
    }
    next();
}