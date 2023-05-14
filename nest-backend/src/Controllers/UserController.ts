import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common"
import {UserService} from "../Services/UserService";
import {ScoreService} from "../Services/ScoreService";
import {CreateUserDTO} from "../DTOs/CreateUserDTO";
import ValidationError from "mongoose"
import { CONNECTED_USER } from "../Decorators/TokenDecorator"
import { User } from "../Schemas/UserSchema"

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly scoreService: ScoreService) {
    }

    @Post('register')
    async RegisterUser(@Body() user: CreateUserDTO): Promise<string> {
        //check if username already exists, otherwise create an user and return the userToken
        console.log("Registering user with payload", user)
        try{
            return await this.userService.RegisterUser(user.username);
        } catch (e) {
            console.log("Error while registering user", e)
            if(e.constructor.name === "ValidationError"){
                throw new HttpException("Username already registered", HttpStatus.CONFLICT)
            }
            throw new HttpException("Username cannot be registered, try later", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('seed')
    async SeedUsers(): Promise<string> {
        return await this.userService.Seed()
    }
}
