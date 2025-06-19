import chalk from "chalk"

function printDifferences(){
    console.log(`${chalk.greenBright(chalk.black('Tipi di accesso e lettura dei modelli del database'))}

La differenza sostanziale consiste nel come l'AI costruisce i dati delle singole colonne dei record.

Una colonna può essere stringa, ma il valore legato ad essa può essere sia una stringa qualsiasi scelta dall'AI
(legata comunque a un contesto, esempio: nome, cognome etc.) che una stringa legata a un ragionamento logico di
chi progetta il database/server. 

Un esempio lampante può essere una tabella ${chalk.cyanBright('"')}${chalk.yellow('amicizie')}${chalk.cyanBright('"')}:
    
    intero   intero       stringa
╔══╦════════╦════════════╦════════════╗
║${chalk.magenta('ID')}║${chalk.bgMagenta(chalk.white('MITTENTE'))}║${chalk.bgMagenta(chalk.white('DESTINATARIO'))}║${chalk.yellow('CHIAVE_AMIC')} ║
╠══╬════════╬════════════╬════════════╣
║ ${chalk.magenta('0')}║       ${chalk.bgMagenta(chalk.white('1'))}║          ${chalk.bgMagenta(chalk.white('82'))}║        1_82║
║ ${chalk.magenta('1')}║      ${chalk.bgMagenta(chalk.white('11'))}║           ${chalk.bgMagenta(chalk.white('1'))}║        1_11║
║ ${chalk.magenta('2')}║      ${chalk.bgMagenta(chalk.white('37'))}║          ${chalk.bgMagenta(chalk.white('52'))}║       37_52║
╚══╩════════╩════════════╩════════════╝

la colonna CHIAVE_AMIC contiene delle stringhe, ma formattate secondo una logica umana 
che l'AI potrebbe non riuscire a replicare. 

Il raw-access fa si che vengano inviate le informazioni relative alle colonne come tipo di dato,
tipo di chiave etc. ma non possono essere in alcun modo specificate logiche di formattazione.

Nel caso di accesso server-project puoi definire lato codice con dei file delle specifiche 
riguardo alcune colonne che devono rispettare una formattazione particolare. basta selezionare
cartella, linguaggio e ORM usato. 

ammettiamo che tu stia usando nodejs con sequelize:
In questo caso devi avere una cartella database/models con dentro dei file relativi ai modelli
ad esempio:
    database/models/Utente.model.js
    database/models/Amicizia.models.js

insieme a questi ci devono essere, laddove necessiti, di file .txt che contengono le specifiche
per le formattazioni delle colonne. 

Implementando lo stesso esempio della tabella amicizie puoi fare:

database/models/Amicizia.spec.txt:
    [CHIAVE_AMIC]: il formato del valore di questa colonna deve essere:
    id1_id2

    gli id si riferiscono alle colonne MITTENTE e DESTINATARIO e sono
    disposti nella colonna CHIAVE_AMIC in ordine crescente e divisi da
    un _.

questi file di testo verranno letti e serviti all'AI come aiuto per capire come generare i dati.

Potrebbero essere anche utili in fase di sviluppo per comunicare ad altri sviluppatori di un team
come sono strutturate le tabelle ;).

`)
}

export {
    printDifferences,
}
