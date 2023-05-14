import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import {UserService} from "../Services/UserService";

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService,) {
    }
    async use(req, res: Response, next: NextFunction) {
        if (req.headers["token"]) {
            const userToken = req.headers["token"].toString();
            console.log("SEARCHING FOR USER TOKEN", userToken)
            const foundUser = await this.userService.getUserByToken(userToken)
            console.log("userFound", foundUser)
            if(foundUser.length === 1){
                req.foundUser = foundUser[0]
                next()
            } else{
                return res.status(401).json({"error": "Invalid token"})
            }
        } else {
            return res.status(401).json({"error": "Not authenticated, header 'token' not valid"})
        }
    }
}
