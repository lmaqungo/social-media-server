import "dotenv/config"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { dbURL } from "../src/utils/loadEnvVars.js"

const connectionString = `${dbURL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }