import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose"
import { User } from "../Schemas/UserSchema"
import { Model } from "mongoose"

@Injectable()
export class GameService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    GetCardByPosition(cardArray: number[], cardPosition: number): number|undefined {
        return cardArray[cardPosition]
    }

    PrepareMatchData(): number[] {
        function shuffle(array) {
            let currentIndex = array.length,  randomIndex;

            // While there remain elements to shuffle.
            while (currentIndex != 0) {

                // Pick a remaining element.
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
            }

            return array;
        }
        /* qui vado a startare un match, quindi:
           1. randomizzo l'array di card number e lo duplico
           2. me lo salvo a DB e lo associo all'utente come lastCardArray
           3. inizializzo il lastMatchStartedTimestamp nell'utente
           4. ritorno OK!
        */
        let cardNumbers = [18, 19, 29, 309, 85, 155, 211, 292 ] //8 coppie
        cardNumbers = [...cardNumbers, ...cardNumbers]
        shuffle(cardNumbers)

        return cardNumbers
    }


}
