import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User } from "../Schemas/UserSchema"
import { HydratedDocument, Model } from "mongoose"

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    async UpdateUser(userToUpdate: User) {
        console.log("Updating user", userToUpdate)
        const user = await this.userModel.updateOne({ _id: userToUpdate._id }, userToUpdate)
    }

    async RegisterUser(username: string): Promise<string> {
        const token = btoa(Math.random().toString())
        const foundUser = await this.userModel.find({ username: username }).exec()
        if (foundUser) {
            console.log("FOUND USER", foundUser)
        }
        const newUser = new this.userModel({
            username: username,
            authToken: token
        })
        await newUser.save()
        return token
    }

    async Seed(): Promise<string> {
        for (let i = 0; i < 20; i++) {
            const user = new this.userModel({
                username: "Bot_" + Math.random(),
                authToken: "<redacted>",
                lastCardArrayPlayed: JSON.stringify([]),
                lastMatchStartedAt: Date.now(),
                lastMatchFinishedAt: Date.now() + Math.floor(Math.random() * (15000 - 30000 + 1)) + 15000,
                lastMatchDuration: Math.floor(Math.random() * (0 - 30000 + 1)) + 30000
            })
            console.log("Inserting user")
            await user.save()
        }
        return "OK"
    }

    async getUserByToken(token: string): Promise<Array<HydratedDocument<User, unknown, {}>>> {
        return await this.userModel.find({ authToken: token }).exec()
    }
}
