import styled from "styled-components"
import { Fade, Grow, Zoom } from "@mui/material"

interface CardContainerProps {
    visibility: boolean
}

const Card = styled.div<CardContainerProps>`
  border-radius: 5px;
  mso-border-shadow: yes;
  box-shadow: 0 8px 6px -6px black;
  background-color: lightgray;
  padding: 5px;
  margin: 5px auto;
  width: 100px;
  height: 100px;
  visibility: ${props => props.visibility ? "visible" : "hidden"};;
`
const CardImage = styled.img`
  width: 100px;
  height: 100px;
  align-self: center;
  border-radius: inherit;
`

function GameCard({ cardNumber, cardPosition, flipCallback, isFlipped, isVisible }: CardObject) {
    const cardUrl = "https://picsum.photos/id/" + (cardNumber ?? 1) + "/100/100" //Pic a random image from loremPicsum
    return (
        <Grow
            in={isVisible}
            style={{ transformOrigin: "0 0 0" }}
            {...(isVisible ? { timeout: 1000 } : {})}
        >
            <Card onClick={async () => {
                if (!isFlipped) {
                    await flipCallback(cardPosition)
                }
            }} visibility={isVisible}>
                <Zoom in={isFlipped} style={{ transitionDelay: isFlipped ? "100ms" : "0ms" }}>
                    <CardImage src={cardUrl} hidden={!isFlipped} />
                </Zoom>
            </Card>
        </Grow>
    )
}

export default GameCard