import "dotenv/config"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from '../../generated/prisma/client.js'

const { NODE_ENV, NEON_DB_URL, LOCAL_DB_URL } = process.env

const pgAdapter = new PrismaPg({ connectionString: LOCAL_DB_URL })
const neonAdapter = new PrismaNeon({ connectionString: NEON_DB_URL})
const prisma = new PrismaClient({
    adapter: NODE_ENV === 'dev' ? pgAdapter : NODE_ENV === 'prod' ? neonAdapter : null
})


export { prisma }