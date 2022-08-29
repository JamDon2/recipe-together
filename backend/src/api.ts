import express, { Request } from "express"
import { roomRepository } from "./db/room"
import { connection } from "./db/client"
import { v4 as uuid } from "uuid"

const router = express.Router()

router.get("/ingredients", async (req, res) => {
    res.json(await connection.json.get("ingredients"))
})

router.get("/room/:id", async (req: Request<{ id: string }>, res) => {
    const room = await roomRepository
        .search()
        .where("id")
        .equals(req.params.id)
        .return.first()

    const roomJSON = room?.toJSON()

    if (room) {
        res.json(roomJSON)
    } else {
        res.statusCode = 404
        res.json({ error: "Room not found" })
    }
})

router.post("/room", async (req, res) => {
    const roomId = uuid()
    const room = await roomRepository.createAndSave({
        id: roomId,
        status: "open",
        ingredients: [],
    })

    res.json({ roomId })
})

export default router
