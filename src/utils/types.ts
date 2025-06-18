
type DBAccessType = 'raw-access' | 'server-project'
type TableColumnInformations = {
    TABLE_NAME: string;                   // Nome della tabella
    COLUMN_NAME: string;                 // Nome della colonna
    DATA_TYPE: string;                   // Tipo di dato (es. 'int', 'varchar', ecc.)
    IS_NULLABLE: 'YES' | 'NO';           // Se la colonna può essere NULL
    COLUMN_KEY: '' | 'PRI' | 'UNI' | 'MUL'; // Tipo di chiave
    EXTRA: string;                       // Info aggiuntive (es. 'auto_increment')
    REFERENCED_TABLE_NAME?: string;      // Tabella referenziata (FK)
    REFERENCED_COLUMN_NAME?: string;     // Colonna referenziata (FK)
};
type DatabaseSchemasInformations = Array<TableColumnInformations>

export type {
    DBAccessType,
    TableColumnInformations,
    DatabaseSchemasInformations,
}
