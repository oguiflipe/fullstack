import { Request, Response } from "express";

import { AuthUserService } from '../../services/user/AuthUserServices';

class AuthUserController{
    async handle(req: Request, res: Response){
        const {email, password} = req.body;

        const authUserServices = new AuthUserService();

        const auth = await authUserServices.execute({
            email, 
            password
        })

        return res.json(auth)
    }
}

export {AuthUserController}