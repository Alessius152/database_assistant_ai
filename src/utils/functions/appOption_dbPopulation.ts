import sequelize from "sequelize"
import chalk from "chalk"
import { RawConnector } from "../classes/RawConnector"
import { BackendLanguage, ChalkFunctionKeys, CustomizedInquirerOption, DatabaseSchemasInformations } from "../types"
import { llm, openai, ormsPerLanguage } from "../objects"
import { cli, inputChoiceFromList, inputChoiceFromListCustomized, inputString } from "./general"
import { ServerProjectAnalizer } from "../classes/ServerProjectAnalizer"

function instructionsPrint() {
    console.log(`
Istruzioni:

    ${chalk.bold(chalk.magenta('1)'))} ${chalk.bgCyanBright(chalk.black('Seleziona tipo di ispezione'))} ( raw-access, server-project )
        - raw-access:
            Inserisci credenziali e il programma ispeziona
            il database per trovare tabelle/modelli
        
        - server-project: 
            Cerca i modelli scritti in un progetto backend 
            (linguaggio di programmazione) con ORM 
            (scelta consigliata)

    ${chalk.bold(chalk.magenta('2)'))}
        RAW-ACCESS:
            ${chalk.bold(chalk.magenta('2.1)'))} ${chalk.bgCyanBright(chalk.black('Inserisci credenziali'))} (host, username, password, port)
            ${chalk.bold(chalk.magenta('2.2)'))} ${chalk.bgCyanBright(chalk.black('Attendi la query'))}

        SERVER-PROJECT:
            ${chalk.bold(chalk.magenta('2.1)'))} ${chalk.bgCyanBright(chalk.black('Seleziona linguaggio usato'))}
            ${chalk.bold(chalk.magenta('2.2)'))} ${chalk.bgCyanBright(chalk.black('Seleziona ORM usato'))}
                Questo software assegna a ogni linguaggio/ORM selezionato 
                una struttura del progetto relativa al database utile per 
                capire dove trovare informazioni relative ai modelli
                Esempio: 
                    Nodejs/Sequelize: La cartella per i modelli sarà la
                    cartella ~project-dir~/database/models
            ${chalk.bold(chalk.magenta('2.3)'))} ${chalk.bgCyanBright(chalk.black('Attendi la ricerca e la generazione della query'))}

`)
}

function generatePromptForAI(database: string, dbData: DatabaseSchemasInformations): string {
    return `Sei un assistente IT esperto, specializzato in database relazionali.

Il tuo compito è generare istruzioni SQL INSERT valide per popolare lo schema del database fornito.

IMPORTANTE:
- Genera istruzioni INSERT molto ricche (non 1 o 2 righe, ma un numero consistente).
- L'output deve contenere solo codice SQL.
- NON includere spiegazioni testuali, commenti, saluti o qualsiasi altro testo.
- L'output deve essere direttamente eseguibile nel DBMS senza alcuna modifica.

Di seguito è riportata la descrizione dello schema del database:

database:${database}:
${(() => {
            const lines: string[] = [];
            const tableNames = new Set(dbData.map(d => d.TABLE_NAME));

            for (const tableName of tableNames) {
                lines.push(`    tabella:${tableName}:`);
                for (const col of dbData.filter(d => d.TABLE_NAME === tableName)) {
                    lines.push(`        colonna:${col.COLUMN_NAME}:`);
                    lines.push(`            TIPO_DI_DATO:${col.DATA_TYPE},`);
                    lines.push(`            PUÒ_ESSERE_NULL:${col.IS_NULLABLE}`);
                    lines.push(`            CHIAVE_COLONNA:${col.COLUMN_KEY}`);
                    lines.push(`            EXTRA:${col.EXTRA}`);
                    lines.push(`            TABELLA_REFERENZIATA:${col.REFERENCED_TABLE_NAME ?? 'null'}`);
                    lines.push(`            COLONNA_REFERENZIATA:${col.REFERENCED_COLUMN_NAME ?? 'null'}`);
                }
            }
            return lines.join('\n');
        })()}

Ricorda: rispondi con solo istruzioni SQL INSERT, nessun altro testo o commento.`;
}

async function executeRawAccess() {
    const host = await inputString('Host: ')
    const username = await inputString('Username: ')
    const password = await inputString('Password: ')
    const database = await inputString('Nome del database: ')
    const port = parseInt(await inputString('Port: '))
    const dialect = await inputChoiceFromList<sequelize.Dialect>('Dialetto del server: ', 'db2', 'mariadb', 'mssql', 'mysql', 'oracle', 'postgres', 'snowflake', 'sqlite')

    // const host = env.host
    // const username = env.username
    // const password = env.password
    // const database = env.database
    // const port = env.port
    // const dialect = env.dialect as sequelize.Dialect

    if (isNaN(port) || ((port < 1) || (port > 65535))) {
        console.log("porta non numero o fuori range.")
        return
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

    await connector.close()

    console.log("Creazione del prompt...")
    const prompt = generatePromptForAI(database, dbData)

    console.log("L'Intelligenza Artificiale sta generando la risposta, attendi un attimo...")
    const chatCompletion = await openai.chat.completions.create({
        model: llm,
        messages: [
            {
                "role": "user",
                "content": prompt
            }
        ],
    })

    const fullText = chatCompletion.choices[0].message.content

    if (!fullText) {
        console.log("la risposta è undefined")
        return
    }

    console.log(fullText)
}

async function executeServerProjectAccess() {

    const colors: Record<BackendLanguage, ChalkFunctionKeys> = {
        NodeJS: 'green',
        PHP: 'blue'
    }

    const language = await inputChoiceFromListCustomized<BackendLanguage>(
        'Linguaggio usato per il backend',
        { label: 'NodeJS', color: colors.NodeJS },
        { label: 'PHP', color: colors.PHP } //php non supportato per ora
    )

    const colorFn = chalk[colors[language] ?? 'white'] as (txt: string) => string

    const orm = await inputChoiceFromListCustomized<typeof ormsPerLanguage[BackendLanguage][number]['ormName']>(
        `Seleziona ORM usato con ${colorFn(language)}`,
        ...ormsPerLanguage[language].map(({ ormName, color }) => {
            return {
                label: ormName,
                color: color ?? 'white'
            }
        })
    )

    const analizer = new ServerProjectAnalizer<typeof language>(language, orm)

}

export {
    instructionsPrint,
    generatePromptForAI,
    executeRawAccess,
    executeServerProjectAccess,
}
