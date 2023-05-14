import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common"
import { GameService } from "../Services/GameService"
import { CONNECTED_USER } from "../Decorators/TokenDecorator"
import { User } from "../Schemas/UserSchema"
import { UserService } from "../Services/UserService"
import { ScoreService } from "../Services/ScoreService"

@Controller("game")
export class GameController {
    constructor(private readonly gameService: GameService, private readonly userService: UserService, private readonly scoreService: ScoreService) {
    }

    @Get("card/:position")
    GetCardByPosition(@CONNECTED_USER() user: User, @Param("position") position: number): string {
        try {
            return this.gameService.GetCardByPosition(JSON.parse(user.lastCardArrayPlayed), position).toString()
        } catch (e) {
            throw new HttpException("Value for parameter Position is not valid", HttpStatus.BAD_REQUEST)
        }
    }

    @Get("finish")
    async FinishMatch(@CONNECTED_USER() user: User): Promise<string> {
        try {
            user.lastMatchFinishedAt = Date.now()
            user.lastMatchDuration = user.lastMatchFinishedAt - user.lastMatchStartedAt
            await this.userService.UpdateUser(user)
        } catch (e) {
            throw new HttpException("User cannot be updated", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return "OK"
    }

    @Get("start")
    async StartMatch(@CONNECTED_USER() user: User): Promise<string> {
        try {
            const cards = this.gameService.PrepareMatchData()
            user.lastCardArrayPlayed = JSON.stringify(cards)
            user.lastMatchStartedAt = Date.now()
            await this.userService.UpdateUser(user)
        } catch (e) {
            throw new HttpException("User cannot be updated or matrix cant be generated", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return "OK"
    }

    @Get("ranking/partial")
    async GetPartialRanking(@CONNECTED_USER() user: User) {
        //unused method
        try {
            return await this.scoreService.getPartialRanking(user._id)
        } catch (e) {
            console.error("Error occured ranking/partial",e)
            throw new HttpException("Generic error, retry later "+e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("ranking")
    async GetRanking(@CONNECTED_USER() user: User) {
        try {
            return await this.scoreService.getFullRanking()
        } catch (e) {
            console.error("Error occured ranking",e)
            throw new HttpException("Generic error, retry later "+e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
