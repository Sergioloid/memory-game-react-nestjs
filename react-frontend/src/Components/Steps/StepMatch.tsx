import styled from "styled-components"
import GameCard from "../BaseComponents/GameCard"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useAppSelector } from "../../redux/hooks"
import _ from "lodash"
import { MatchStatus } from "../Classes/Enums/MatchStatus"
import { GameStep } from "../Classes/Enums/GameStep"
import { Button } from "@mui/material"

const CardsContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  margin: 0 auto;
  flex-wrap: wrap;
  width: 55vw;
`
const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`

type cardMemoProps = {
    cardObject: CardObject
}
export const GameCardMemo = React.memo<cardMemoProps>(({ cardObject }) => {
    console.log("CardObject changed", cardObject)
    return (
        <GameCard {...cardObject} />
    )
}, (prev, next) => {
    console.log("Memoing", prev, next)
    return _.isEqual(prev, next)
})

function StepMatch({ callback }: StepProps) {
    const userToken = useAppSelector((state) => state.token.value)
    const username = useAppSelector((state) => state.token.username)
    const initializeCards = () => {
        let cardArray = []
        for (let i = 0; i < 16; i++) {
            cardArray[i] = {
                cardPosition: i,
                cardNumber: undefined,
                flipCallback: flipCard,
                isFlipped: false,
                isVisible: true
            }
        }
        return cardArray
    }

    const flipCard = async (cardPosition: number) => {
        if (cards.length > 0 && cards[cardPosition]) {
            const flippedCards = cards.filter(card => card.isFlipped)

            if (flippedCards.length < 2) {
                if (cards[cardPosition].cardNumber === undefined) {
                    //chiamo il server per aggiornare la carta
                    await fetch(process.env.REACT_APP_API_URL + "game/card/" + cards[cardPosition].cardPosition, {
                        headers: {
                            "token": userToken
                        }
                    }).then((response) => response.text()).then((response) => cards[cardPosition].cardNumber = parseInt(response)).catch((e) => toast.error("Qualcosa è andato storto, riprova più tardi"))
                }
                setTimeout(() => {
                    if (flippedCards.length <= 1) {
                        cards[cardPosition].isFlipped = true
                    }
                    setCards([...cards])
                }, 50)
            }
        }
    }

    const initGame = () => {
        toast.success("Gioco in fase di avvio, hai 3 secondi, preparati!")
        setTimeout(() => {
            console.log("Attempt to start the game with Token", userToken)
            fetch(process.env.REACT_APP_API_URL + "game/start", {
                headers: {
                    "token": userToken
                }
            }).then((response) => {
                if (response.status === 401) {
                    throw new Error("Non autorizzato")
                } else {
                    setMatchStatus(MatchStatus.MATCH_INPROGRESS)
                }
            }).catch((e) => toast.error("Impossibile iniziare il gioco\n" + e.message))
        }, 3000)
        //far partire il gioco
        //far partire il timer
    }

    const [cards, setCards] = useState<CardObject[]>(initializeCards())
    const [matchStatus, setMatchStatus] = useState<number>(0) //0 loading, 1 started, 2 finished
    const [elapsedTime, setElapsedTime] = useState<number>(0)


    useEffect(() => {
        console.log("Montato")
    }, [])

    useEffect(() => {

        const flippedCards = cards.filter(card => card.isFlipped)
        const completedCards = cards.filter(card => !card.isVisible)
        if (flippedCards.length === 2) {
            let matchedNumber = 0
            if (flippedCards[0].cardNumber && flippedCards[1].cardNumber && flippedCards[0].cardNumber === flippedCards[1].cardNumber) {
                matchedNumber = flippedCards[0].cardNumber
            }
            cards.forEach((card) => {
                if (card.isFlipped && card.cardNumber === matchedNumber) {
                    card.isVisible = false
                    toast.success("È una coppia!")
                }
                card.isFlipped = false
            })
            setTimeout(() => {
                //Devo dare un minimo di attesa altrimenti l'utente vede tutto veloce
                setCards([...cards])
            }, 1000)
        }

        if (completedCards.length === cards.length && matchStatus !== 2) {
            setMatchStatus(2)
        }
    }, [cards])

    useEffect(() => {
        console.log("Time is running", elapsedTime)
        if (matchStatus === MatchStatus.MATCH_INPROGRESS || matchStatus === MatchStatus.MATCH_ENDED) {
            let timeout = setTimeout(() => setElapsedTime(elapsedTime + 1), 1000)
            if (elapsedTime === 30 || matchStatus === MatchStatus.MATCH_ENDED) {
                clearTimeout(timeout)
                setMatchStatus(MatchStatus.MATCH_ENDED)
            }
        }
    }, [elapsedTime, matchStatus])

    useEffect(() => {
        if (matchStatus === MatchStatus.MATCH_ENDED) {
            fetch(process.env.REACT_APP_API_URL + "game/finish", {
                headers: {
                    "token": userToken
                }
            }).then((response) => {
                if (response.status === 401) {
                    throw new Error("Non autorizzato")
                } else {
                    setTimeout(() => callback(GameStep.FINISH), 5000)
                }
            }).catch((e) => toast.error("Impossibile completare il gioco\n" + e.message))
        }
    }, [matchStatus])

    return (
        <div>
            {
                matchStatus === MatchStatus.MATCH_INPROGRESS && <h3 style={{color: (elapsedTime>20 ? "red" : "green")}}>VELOCE {username}<br />IL TEMPO PASSA! {elapsedTime}s</h3>
            }
            {
                matchStatus === MatchStatus.MATCH_INPROGRESS && cards.length > 0 &&
                <CardsContainer>
                    {cards.map((card: CardObject) => {
                        return <GameCard {...card} />
                    })}</CardsContainer>
            }
            {
                matchStatus === MatchStatus.MATCH_STANDBY && <div style={{margin: 150}}>
                    <Button variant="contained" onClick={() => initGame()}>INIZIA!</Button>
                </div>
            }
            {
                matchStatus === MatchStatus.MATCH_INPROGRESS && <div style={{margin: 15}}>
                    <Button variant="contained" onClick={() => setMatchStatus(MatchStatus.MATCH_ENDED)}>CLICCA PER BARARE</Button>
                </div>
            }
            {
                matchStatus === MatchStatus.MATCH_ENDED && <div style={{margin: 150}}><h1>Match finito!</h1></div>
            }
        </div>
    )
}

export default StepMatch