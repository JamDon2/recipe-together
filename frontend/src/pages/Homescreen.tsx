import React from "react"
import { Button } from "@mui/material"
import API from "../api"
import { useNavigate } from "react-router-dom"
import "./Homescreen.css"

export default function Homescreen() {
    const navigate = useNavigate()

    const onClick = async () => {
        const roomId = (await API.post("/room")).data.roomId
        navigate(`/recipes/${roomId}`)
    }
    return (
        <div className="center">
            <h1 style={{ fontFamily: "Roboto" }}>Recipe Together!</h1>
            <Button variant="contained" onClick={onClick}>
                Create session
            </Button>
        </div>
    )
}
