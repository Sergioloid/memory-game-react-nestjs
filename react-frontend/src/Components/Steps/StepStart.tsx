import styled from "styled-components"
import {useState} from "react"
import toast from "react-hot-toast"
import {GameStep} from "../Classes/Enums/GameStep"
import {setToken, setTokenUsername} from "../../redux/slices/tokenSlice"
import {useAppDispatch} from "../../redux/hooks"
import {Button, TextField} from "@mui/material"
import {setApiString} from "../../redux/slices/apiResponseSlice"

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`
const UsernameInput = styled.input`
  display: flex;
  flex-direction: row;
`
const SubmitButton = styled.div`
  height: 4em;
  text-align: center;
`

function StepStart({callback}: StepProps) {
    const dispatch = useAppDispatch()

    const [username, setUsername] = useState<string>("")

    const registerUsername = () => {
        console.log("Registering user with username", username)
        if (process.env.REACT_APP_API_URL) {
            fetch(
                process.env.REACT_APP_API_URL + "user/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "username": username
                    })
                }
            ).then((response) => {
                if (response.status === 409) {
                    //duplicato, refreshare
                    setUsername("")
                    toast.error("Username già registrato, scegline un altro plis")
                } else {
                    return response.text()
                }
            }).then((response) => {
                dispatch(setToken(response ?? ""))
                dispatch(setTokenUsername(username ?? ""))
                dispatch(setApiString("POST user/register\n" + response))
                toast.success("Utente creato con successo!")
                setTimeout(() => callback(GameStep.PLAY), 1000)
            }).catch((e) => toast.error("Qualcosa è andato storto, riprova più tardi"))
        } else{
            toast.error("Variabile d'ambiente non trovata, per favore rebuilda il tutto")
        }

    }

    const seedDatabase = () => {
        console.log("Seeding DB")
        fetch(
            process.env.REACT_APP_API_URL + "user/seed"
        ).then((response) => {
            if (response.status !== 200) {
                throw new Error("")
            } else {
                toast.success("Utenti creati!")
            }
        }).catch((e) => toast.error("Qualcosa è andato storto, riprova più tardi"))
    }

    return (
        <LoginContainer>
            <h1>THE MEMORY GAME!</h1>

            <p style={{fontFamily: "roboto"}}>Inserisci il tuo username e sfida la classifica</p>
            <div style={{margin: 15}}>
                <TextField
                    required
                    id="outlined-required"
                    label="Inserisci username"
                    onChange={(e) => {
                        if (e.currentTarget.value.match(/^[a-zA-Z0-9]+$/) !== null) {
                            setUsername(e.currentTarget.value)
                        }
                    }} value={username}/>
            </div>
            <div style={{margin: 15}}>
                <Button variant="contained" disabled={username === ""} onClick={() => {
                    if (username !== "") {
                        registerUsername()
                    }
                }}>CLICCA PER INIZIARE
                </Button>
            </div>
            <div style={{margin: 15}}>
                <Button variant="contained" onClick={() => {
                    seedDatabase()
                }}>DATABASE SEED
                </Button>
            </div>
        </LoginContainer>
    )
}

export default StepStart