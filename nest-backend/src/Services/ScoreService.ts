import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User } from "../Schemas/UserSchema"
import { Model } from "mongoose"

@Injectable()
export class ScoreService {

    private excludedKeys = ["-authToken", "-lastCardArrayPlayed", "-_id", "-__v", "-lastMatchStartedAt", "-lastMatchFinishedAt"]
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    async getPartialRanking(userId: string) {
        // const partialRank = await this.userModel.find().sort({
        //     lastMatchDuration: 1,
        //     lastMatchStartedAt: 1
        // }).select(this.excludedKeys)
        // console.log("Searching for userId", userId)
        // const position = await this.userModel.find({ _id: { $lt: userId } }).sort({ lastMatchDuration: 1 }).count()
        // console.log("allrank", partialRank)
        // const rankWithAggregation = await this.userModel.aggregate( [
        //     {
        //         '$addFields': { ranking: {  lastMatchStartedAt: '$lastMatchStartedAt', lastMatchDuration: '$lastMatchDuration' } }
        //     },
        //     {
        //         $setWindowFields: {
        //             partitionBy: "$lastMatchDuration",
        //             sortBy: { ranking: 1 },
        //             output: {
        //                 rankingPosition: {
        //                     $rank: {}
        //                 }
        //             }
        //         }
        //     }
        // ] )
        // console.log("position", position)
        // return position
    }

    async getFullRanking() {
        const fullRank = await this.userModel.find().sort({
            lastMatchDuration: 1,
            lastMatchStartedAt: 1
        }).select(this.excludedKeys)
        return fullRank
    }
}
