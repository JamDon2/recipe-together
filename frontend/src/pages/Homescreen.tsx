import React from "react"
import { Button } from "@mui/material"
import API from "../api"
import { useNavigate } from "react-router-dom"

export default function Homescreen() {
    const navigate = useNavigate()

    const onClick = async () => {
        const roomId = (await API.post("/room")).data.roomId
        navigate(`/recipes/${roomId}`)
    }
    return (
        <>
            <Button variant="contained" onClick={onClick}>
                Create session
            </Button>
        </>
    )
}
