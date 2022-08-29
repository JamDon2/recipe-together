import { Entity, EntityData, Schema } from "redis-om"

import client from "./client.js"

interface Room {
    id: string
    status: string
    ingredients: string[]
}

class Room extends Entity {}

const roomSchema = new Schema(Room, {
    id: { type: "string", indexed: true },
    status: { type: "string" },
    ingredients: { type: "string[]" },
})

export const roomRepository = client.fetchRepository(roomSchema)

await roomRepository.createIndex()
