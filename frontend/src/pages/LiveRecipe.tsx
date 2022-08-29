import JoinedSession from "./JoinedSession"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { RoomError } from "../routes/Recipe"
import { Ingredient } from "./JoinedSession"
import { Alert } from "@mui/material"

import io from "socket.io-client"

const socket = io("http://localhost:3001")

export default function LiveRecipe({
    setUpdate,
    mealType,
}: {
    setUpdate: (update: number | ((prevValue: number) => number)) => void
    mealType: string
}) {
    const [joined, setJoined] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { id } = useParams()

    useEffect(() => {
        socket.emit("join", id)

        socket.on("join", (...args) => {
            setJoined(false)
            setWaiting(false)
            setError(null)

            if (args[0] === "success") {
                setWaiting(true)
            } else if (args[0] === "full") {
                setError("Room is full")
            } else {
                setError("Unknown error")
            }
        })

        socket.on("start", () => {
            setWaiting(false)
            setJoined(true)
            setError(null)
        })

        socket.on("end", () => {
            setUpdate((update: number) => update + 1)
        })
    }, [id])

    const onChosen = (ingredient: Ingredient, amount: string) => {
        socket.emit("chosen", ingredient.name, amount)
    }

    return (
        <>
            {waiting && (
                <Alert severity="info">Waiting for people to join</Alert>
            )}
            {joined && (
                <JoinedSession onChosen={onChosen} mealType={mealType} />
            )}
            {error && <RoomError message={error} />}
        </>
    )
}
