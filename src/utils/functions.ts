import inquirer from "inquirer"
import { DatabaseSchemasInformations } from "./types"

function instructionsPrint() {
    console.log("Database Population Automizer CLI")
    console.log(`
Istruzioni:

    1) Seleziona tipo di ispezione ( raw-access, server-project )
        - raw-access:
            Inserisci credenziali e il programma ispeziona
            il database per trovare tabelle/modelli
        
        - server-project: 
            Cerca i modelli scritti in un progetto backend 
            (linguaggio di programmazione) con ORM 
            (scelta consigliata)

    2)
        RAW-ACCESS:
            2.1) Inserisci credenziali (host, username, password, port)
            2.2) Attendi la query

        SERVER-PROJECT:
            2.1) Seleziona linguaggio usato
            2.2) Seleziona ORM usato
                Questo software assegna a ogni linguaggio/ORM selezionato 
                una struttura del progetto relativa al database utile per 
                capire dove trovare informazioni relative ai modelli
                Esempio: 
                    Nodejs/Sequelize: La cartella per i modelli sarà la
                    cartella ~project-dir~/database/models
            2.3) attendi la ricerca e la generazione della query

`)
}

async function inputChoiceFromList<T extends string>(msg: string, ...choices: T[]): Promise<T> {

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: msg,
            choices: choices,
        }
    ])

    return answer.choice

}

async function inputString<T extends string>(msg: string): Promise<T> {

    const answer = await inquirer.prompt([
        {
            type: 'input',
            message: msg,
            name: 'str'
        }
    ])

    return answer.str

}

function generatePromptForAI(database: string, dbData: DatabaseSchemasInformations): string {
    return `You are an expert IT assistant specialized in relational databases.

Your task is to generate valid SQL INSERT statements to populate the given database schema.

IMPORTANT:
- Make INSERT statements very rich (no 1/2 rows, big number)
- Output must contain only SQL code.
- Do NOT include any textual explanations, comments, greetings, or any other text.
- Your output must be directly executable in the DBMS without any modification.

Below is the database schema description:

database:${database}:
${(() => {
        const lines: string[] = [];
        const tableNames = new Set(dbData.map(d => d.TABLE_NAME));

        for (const tableName of tableNames) {
            lines.push(`    table:${tableName}:`);
            for (const col of dbData.filter(d => d.TABLE_NAME === tableName)) {
                lines.push(`        column:${col.COLUMN_NAME}:`);
                lines.push(`            DATA_TYPE:${col.DATA_TYPE},`);
                lines.push(`            IS_NULLABLE:${col.IS_NULLABLE}`);
                lines.push(`            COLUMN_KEY:${col.COLUMN_KEY}`);
                lines.push(`            EXTRA:${col.EXTRA}`);
                lines.push(`            REFERENCED_TABLE_NAME:${col.REFERENCED_TABLE_NAME ?? 'null'}`);
                lines.push(`            REFERENCED_COLUMN_NAME:${col.REFERENCED_COLUMN_NAME ?? 'null'}`);
            }
        }
        return lines.join('\n');
    })()}

Remember: respond with **only SQL INSERT statements**, no other text or commentary.`;
}


export {
    instructionsPrint,
    inputChoiceFromList,
    inputString,
    generatePromptForAI,
}