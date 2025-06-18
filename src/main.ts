
import { generatePromptForAI, inputChoiceFromList, inputString, instructionsPrint } from "./utils/functions"
import { DBAccessType } from './utils/types'
import { RawConnector } from './utils/db-raw-connector'
import { InferenceClient } from "@huggingface/inference"
import env from "./env"
import sequelize from "sequelize"

main()

async function main() {

    const client = new InferenceClient(env.accessToken)

    console.clear()
    instructionsPrint()

    const accessType = await inputChoiceFromList<DBAccessType>('Come devo accedere al database?', 'raw-access', 'server-project')

    if (accessType === 'raw-access') {

        const host = await inputString('Host: ')
        const username = await inputString('Username: ')
        const password = await inputString('Password: ')
        const database = await inputString('Nome del database: ')
        const port = parseInt(await inputString('Port: '))
        const dialect = await inputChoiceFromList<sequelize.Dialect>('Dialetto del server: ', 'db2', 'mariadb', 'mssql', 'mysql', 'oracle', 'postgres', 'snowflake', 'sqlite')

        if (isNaN(port) || ((port < 1) || (port > 65535))) {
            console.log("porta non numero o fuori range.")
        }

        const connector = new RawConnector(host, username, password, port, database, dialect)
        const connectionExit = await connector.testConnection()

        console.log('\n')

        if (!(connectionExit === 'ok')) {
            console.log(connectionExit)
            for (let i = 0; i < 20; i++) {
                console.log("❌Errore di connessione SOPRA!")
            }
            return
        }

        console.log("☑️Connessione riuscita!")

        console.log("Elenco tabelle...")
        const dbData = await connector.getTables()
        // console.log(dbData) //se stai lavorando qui puoi decommentare il log per capire che formato ritorna

        console.log("Creazione del prompt...")
        const prompt = generatePromptForAI(database, dbData)

        console.log("L'Intelligenza Artificiale sta generando la risposta, attendi un attimo...")
        const chatCompletion = await client.chatCompletion({
            provider: "cerebras",
            model: "Qwen/Qwen3-32B",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        })

        const fullText = chatCompletion.choices[0].message.content
        
        if(!fullText){
            console.log("la risposta è undefined")
            return
        }

        // Regex per estrarre contenuto tra ``` (primo blocco solo)
        const match = fullText.match(/```(?:sql)?\n([\s\S]*?)```/i)
        const codeOnly = match ? match[1].trim() : fullText.trim()

        console.log(codeOnly);
    }

    if (accessType === 'server-project') {

        return

    }

}
