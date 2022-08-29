import http from "http"
import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import "dotenv/config"
import apiRouter from "./api"
import { validate } from "uuid"
import { roomRepository } from "./db/room"

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use("/api", apiRouter)

const io = new Server(server, { cors: { origin: "*" } })

io.on("connection", socket => {
    socket.on("join", async (...args) => {
        const roomCount = (await io.to(args[0]).fetchSockets()).length
        const roomEntity = await roomRepository
            .search()
            .where("id")
            .equals(args[0])
            .first()

        if (roomEntity) {
            if (roomEntity.status === "open") {
                if (roomCount < 5) {
                    await socket.join(args[0])
                    socket.emit("join", "success")

                    if (roomCount + 1 === 5) {
                        if (roomEntity) {
                            roomEntity.status = "in_progress"
                            await roomRepository.save(roomEntity)

                            io.to(args[0]).emit("start")
                        }
                    }
                } else {
                    socket.emit("join", "full")
                }
            } else {
                socket.emit("join", "not_open")
            }
        } else {
            socket.emit("join", "not_found")
        }
    })

    socket.on("chosen", async (...args) => {
        for (const room of socket.rooms.values()) {
            if (validate(room)) {
                const roomEntity = await roomRepository
                    .search()
                    .where("id")
                    .equals(room)
                    .first()

                if (roomEntity) {
                    roomEntity.ingredients.push(`${args[0]}|${args[1]}`)

                    await roomRepository.save(roomEntity)

                    if (roomEntity.ingredients.length == 5) {
                        roomEntity.status = "completed"
                        await roomRepository.save(roomEntity)

                        io.to(room).emit("end")
                    }
                }
            }
        }
    })
})

server.listen(3001)
