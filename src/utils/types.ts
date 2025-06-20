import chalk from "chalk";
import { nodeOrmNames, phpOrmNames } from "./objects";

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
}

type DatabaseSchemasInformations = Array<TableColumnInformations>

type BackendLanguage = 'NodeJS' | 'PHP'

type NodeOrmName = typeof nodeOrmNames[number]
type PhpOrmName = typeof phpOrmNames[number]

type OrmNamesMap = {
  NodeJS: NodeOrmName;
  PHP: PhpOrmName;
}

type ORMEntry<T extends string = string> = {
  ormName: T;
  color: ChalkFunctionKeys;
}

type ChalkFunctionKeys = {
  [K in keyof typeof chalk]: typeof chalk[K] extends (...args: any[]) => any ? K : never
}[keyof typeof chalk]

type CustomizedInquirerOption<TLabel extends string = string> = {
  label: TLabel
  color: ChalkFunctionKeys
}

export type {
  DBAccessType,
  TableColumnInformations,
  DatabaseSchemasInformations,
  BackendLanguage,
  NodeOrmName,
  PhpOrmName,
  OrmNamesMap,
  ORMEntry,
  ChalkFunctionKeys,
  CustomizedInquirerOption,
}
