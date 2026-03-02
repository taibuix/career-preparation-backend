import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'fs'
import path from 'path'

let sslConfig;
if (process.env.RENDER) {
    sslConfig = {
        rejectUnauthorized: true,
        ca: process.env.AIVEN_CA_CERT,
    }
}
else {
    sslConfig = {
        rejectUnauthorized: true,
        ca: fs.readFileSync(
            path.resolve(process.cwd(), "certs/ca.pem")
        ).toString()
    }
}
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    ssl: sslConfig,
})

const prisma = new PrismaClient({
    adapter,
})

export default prisma