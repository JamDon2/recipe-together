import { Client } from "redis-om"
import { createClient } from "redis"

export const connection = createClient({ url: process.env.REDIS_URL })
await connection.connect()

const client = await new Client().use(connection)

export default client
