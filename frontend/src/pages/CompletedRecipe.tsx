import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api"
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
} from "@mui/material"

export default function CompletedRecipe({ mealType }: { mealType: string }) {
    const { id } = useParams()
    const [ingredients, setIngredients] = useState<string[]>()

    useEffect(() => {
        const fetchData = async () => {
            const room = (await API.get("/room/" + id).catch(() => {}))?.data

            if (room) {
                setIngredients(room?.ingredients)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ingredient</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients &&
                            ingredients.map(row => (
                                <TableRow key={row}>
                                    <TableCell component="th" scope="row">
                                        {row.split("|")[0]}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.split("|")[1]}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <span
                style={{
                    fontFamily: "Roboto",
                    position: "absolute",
                    left: "50%",
                    marginTop: "10px",
                    transform: "translateX(-50%)",
                }}
            >
                The meal type was <strong>{mealType}</strong>
            </span>
        </>
    )
}
