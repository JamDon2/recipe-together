import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Recipes() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate(-1)
    }, [])

    return <></>
}
