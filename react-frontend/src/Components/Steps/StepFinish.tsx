import { useEffect, useState } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"
import { GameStep } from "../Classes/Enums/GameStep"
import { setApiString } from "../../redux/slices/apiResponseSlice"

const ScoresContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin: 0 auto;
  width: 75vw;
`

function StepFinish({ callback }: StepProps) {
    const dispatch = useAppDispatch()

    const userToken = useAppSelector((state) => state.token.value)
    const username = useAppSelector((state) => state.token.username)

    const [scores, setScores] = useState<Score[]>([])
    const [isFullRanking, setIsFullRanking] = useState<boolean>(false)
    const [userPosition, setUserPosition] = useState<number>(0)

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + "game/ranking", {
            headers: {
                "token": userToken
            }
        }).then((response) => response.json()).then((json) => {
            dispatch(setApiString("GET game/ranking\n"+JSON.stringify(json, null, 2)))

            setScores(json.filter((score: Score) => score.lastMatchDuration))
        })
    }, [])

    useEffect(() => {
        setUserPosition(scores.findIndex((score) => score.username === username))
    }, [scores])
    return (
        <ScoresContainer>
            <div style={{ margin: 15 }}>
                <h3>Ti sei posizionato: {userPosition+1}</h3>
                <Button variant="contained" onClick={() => {
                    setIsFullRanking(!isFullRanking)
                }}>VEDI CLASSIFICA {isFullRanking ? "PARZIALE" : "COMPLETA"}
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Posizione</TableCell>
                            <TableCell>Utente</TableCell>
                            <TableCell align="right">Tempo (s)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scores.map((score, index) => {
                            if (!isFullRanking) {
                                if (index > (userPosition + 3) || index < (userPosition - 3)) {
                                    return
                                }
                            }
                            return (
                                <TableRow
                                    key={score.username}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {score.username === username ? <b>{score.username}</b> : score.username}
                                    </TableCell>
                                    <TableCell align="right">{parseInt(score.lastMatchDuration) / 1000}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ margin: 15 }}>
                <Button variant="contained" onClick={() => {
                    callback(GameStep.START)
                }}>CLICCA PER RICOMINCIARE
                </Button>
            </div>
        </ScoresContainer>
    )
}

export default StepFinish