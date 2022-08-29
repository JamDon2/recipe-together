import { useState, useEffect } from "react"

import LiveRecipe from "../pages/LiveRecipe"
import CompletedRecipe from "../pages/CompletedRecipe"
import { useParams } from "react-router-dom"
import API from "../api"
import { Alert, AlertTitle } from "@mui/material"

function sleep(delay = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

export function RoomError({ message }: { message: string }) {
    return (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {message}
        </Alert>
    )
}

function RoomLoading() {
    return <Alert severity="info">Loading...</Alert>
}

export default function Recipe() {
    const { id } = useParams()
    const [element, setElement] = useState<JSX.Element>(<RoomLoading />)

    // a way re-run the fetching from the child component
    const [update, setUpdate] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const room = (await API.get("/room/" + id).catch(() => {}))?.data

            if (room?.status) {
                if (room.status === "open") {
                    setElement(
                        <LiveRecipe
                            setUpdate={setUpdate}
                            mealType={room.mealType}
                        />
                    )
                } else if (room.status === "completed") {
                    setElement(<CompletedRecipe mealType={room.mealType} />)
                } else if (room.status === "in_progress") {
                    setElement(
                        <RoomError message="This session has already started" />
                    )
                } else {
                    setElement(<RoomError message="Unknown Error" />)
                }
            } else {
                setElement(<RoomError message="Session not found" />)
            }
        }

        fetchData()
    }, [id, update])

    return <>{element}</>
}
