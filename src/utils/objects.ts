import OpenAI from "openai"
import env from "../env"
import { BackendLanguage, ChalkFunctionKeys, ORMEntry, OrmNamesMap } from "./types"

const LLM_API_baseUrl = "https://openrouter.ai/api/v1"

const openai = new OpenAI({
    baseURL: LLM_API_baseUrl,
    apiKey: env.openRouter_apiKey,
})

const llm = 'moonshotai/kimi-dev-72b:free'

const nodeOrmNames = ['Sequelize', 'TypeORM', 'Prisma', 'Objection.js'] as const
const phpOrmNames = ['Eloquent', 'Doctrine'] as const

const ormsPerLanguage: { [L in BackendLanguage]: Array<ORMEntry<OrmNamesMap[L]>> } = {
    NodeJS: [
        {
            ormName: 'Sequelize',
            color: 'blueBright' 
        },
        {
            ormName: 'TypeORM',
            color: 'magentaBright'
        },
        {
            ormName: 'Prisma',
            color: 'greenBright'
        },
        {
            ormName: 'Objection.js',
            color: 'yellow'
        }
    ],
    PHP: [
        {
            ormName: 'Eloquent',
            color: 'red'
        },
        {
            ormName: 'Doctrine',
            color: 'magenta'
        }
    ],
}

export {
    LLM_API_baseUrl,
    openai,
    llm,
    nodeOrmNames,
    phpOrmNames,
    ormsPerLanguage,
}