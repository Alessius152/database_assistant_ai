
import mysql from 'mysql2'
import sequelize, { Sequelize } from 'sequelize'
import { DatabaseSchemasInformations } from './types'

class RawConnector {

    private sequelizeConfig: Sequelize

    constructor(
        private readonly host: string,
        private readonly username: string,
        private readonly password: string,
        private readonly port: number,
        private readonly database: string,
        private readonly dialect: sequelize.Dialect
    ) {
        this.sequelizeConfig = new Sequelize({ host, username, password, port, database, dialect, logging: false })
    }

    async testConnection(): Promise<'ok' | Object> {
        try {
            await this.sequelizeConfig.authenticate()
            return 'ok'
        } catch (err: any) {
            return err
        }
    }

    async getTables(): Promise<DatabaseSchemasInformations> {
        const query = this.query_getAllSchemas();
        const [results] = await this.sequelizeConfig.query(query)

        return results as DatabaseSchemasInformations/*attenzione, 
        essendo il results basato sul risultato della query 
        all'aggiunta delle query corrispondenti ai dialetti nello switch,
        assicurarsi che il risultato restituito corrisponda al tipo di ritorno dopo l'as
        perché deve essere un array di oggetti con chiavi specifiche che descrivono ogni 
        colonna di ogni tabella.
        */
    }

    private query_getAllSchemas(dialect: sequelize.Dialect = this.dialect): string {
        switch (this.dialect) {

            case 'db2':
                return ``
            case 'oracle':
                return ``
            case 'snowflake':
                return ``

            case 'mariadb':
                return ``
            case 'mssql':
                return ``
            case 'mysql':
                return `SELECT 
    c.TABLE_NAME, 
    c.COLUMN_NAME,
    c.DATA_TYPE, 
    c.IS_NULLABLE, 
    c.COLUMN_KEY, 
    c.EXTRA, 
    kcu.REFERENCED_TABLE_NAME, 
    kcu.REFERENCED_COLUMN_NAME
FROM information_schema.COLUMNS AS c
LEFT JOIN information_schema.KEY_COLUMN_USAGE AS kcu 
ON c.TABLE_NAME = kcu.TABLE_NAME
AND c.COLUMN_NAME = kcu.COLUMN_NAME 
AND c.TABLE_SCHEMA = kcu.TABLE_SCHEMA 
AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
WHERE c.TABLE_SCHEMA = '${this.database}' 
ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION;
`
            case 'postgres':
                return ``
            case 'sqlite':
                return ``
        }
    }

}

export {
    RawConnector,
}
