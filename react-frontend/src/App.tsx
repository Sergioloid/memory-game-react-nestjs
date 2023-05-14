import React, { useState } from "react"
import "./App.css"
import StepMatch from "./Components/Steps/StepMatch"
import StepStart from "./Components/Steps/StepStart"
import StepFinish from "./Components/Steps/StepFinish"
import styled from "styled-components"
import { Toaster } from "react-hot-toast"
import { GameStep } from "./Components/Classes/Enums/GameStep"
import { AppBar, Box, Button, Dialog, IconButton, Toolbar, Typography } from "@mui/material"
import { useAppSelector } from "./redux/hooks"
import CloseIcon from '@mui/icons-material/Close';
const AppContainer = styled.div`
  text-align: center;
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: column;
`

function App() {
    const lastApiResponse = useAppSelector((state) => state.apiResponse.value)

    const [currentStep, setCurrentStep] = useState<number>(GameStep.START)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const getCurrentStepView = () => {
        switch (currentStep) {
            case GameStep.START:
            default:
                return <StepStart callback={setCurrentStep} />
            case GameStep.PLAY:
                return <StepMatch callback={setCurrentStep} />
            case GameStep.FINISH:
                return <StepFinish callback={setCurrentStep} />

        }
    }
    return (
        <AppContainer>
            <Toaster position="top-right"/>
            {getCurrentStepView()}
            {/*<div style={{margin: 15}}>*/}
            {/*    <Button onClick={handleOpen}>APRI LOG ULTIMA CHIAMATA API</Button>*/}
            {/*    <Modal*/}
            {/*        open={open}*/}
            {/*        onClose={handleClose}*/}
            {/*        aria-labelledby="modal-modal-title"*/}
            {/*        aria-describedby="modal-modal-description"*/}
            {/*    >*/}

            {/*    </Modal>*/}
            {/*</div>*/}
            <div>
                <Button variant="outlined" onClick={handleOpen}>
                    APRI LOG ULTIMA CHIAMATA API
                </Button>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon color={"disabled"} fontSize="large"/>
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Risultato ultima chiamata API
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box style={{margin: 15}}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{whiteSpace: 'pre-line'}}>
                            {lastApiResponse}
                        </Typography>
                    </Box>
                </Dialog>
            </div>
        </AppContainer>
    )
}

export default App
