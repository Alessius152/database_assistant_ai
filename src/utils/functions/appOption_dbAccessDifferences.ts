import chalk from "chalk"

function printDifferences() {
    console.log(`${chalk.greenBright.bold('📚 Tipi di accesso e lettura dei modelli del database')}

L'AI può generare i dati per ogni colonna di una tabella in due modi:

1. In modo generico (es. nomi, cognomi, città)
2. Seguendo regole logiche create da chi ha progettato il database

---

🔍 Esempio pratico: tabella ${chalk.yellowBright('"amicizie"')}

Una colonna può sembrare semplice (come una stringa), ma in realtà seguire una regola precisa.

Guarda questa tabella:

╔══╦════════╦════════════╦════════════╗
║${chalk.magenta('ID')}║${chalk.bgMagenta.white('MITTENTE')}║${chalk.bgMagenta.white('DESTINATARIO')}║${chalk.yellow('CHIAVE_AMIC')} ║
╠══╬════════╬════════════╬════════════╣
║ ${chalk.magenta('0')}║       ${chalk.bgMagenta.white('1')}║          ${chalk.bgMagenta.white('82')}║        1_82║
║ ${chalk.magenta('1')}║      ${chalk.bgMagenta.white('11')}║           ${chalk.bgMagenta.white('1')}║        1_11║
║ ${chalk.magenta('2')}║      ${chalk.bgMagenta.white('37')}║          ${chalk.bgMagenta.white('52')}║       37_52║
╚══╩════════╩════════════╩════════════╝

➡️ La colonna ${chalk.cyan('CHIAVE_AMIC')} è una stringa costruita secondo una ${chalk.cyan('logica')}:
- Prende gli ID da MITTENTE e DESTINATARIO
- Li ordina in modo crescente
- Li unisce con un trattino basso: \`id1_id2\`

Questa regola ${chalk.cyan('non può essere dedotta automaticamente dall’AI')}, a meno che tu non la specifichi da qualche parte.

---

⚙️ Tipi di accesso ai modelli del database

🟢 ${chalk.bold('Raw-access')}
- Invia solo dati tecnici: tipo della colonna, se è chiave primaria, ecc.
- ❌ Non puoi definire regole particolari di formattazione

🟡 ${chalk.bold('Server-project access')}
- Ti permette di specificare regole extra, usando dei file \`.txt\`
- Devi solo indicare:
  - La cartella dei modelli
  - Il linguaggio (es. Node.js)
  - L’ORM usato (es. Sequelize)

Esempio per Sequelize in Node.js:

📁 Struttura:
\`\`\`
database/models/Utente.model.js
database/models/Amicizia.model.js
database/models/Amicizia.spec.txt
\`\`\`

📄 Contenuto di \`Amicizia.spec.txt\`:
\`\`\`
[CHIAVE_AMIC]: il formato del valore di questa colonna deve essere:
id1_id2

gli id si riferiscono alle colonne MITTENTE e DESTINATARIO
e sono ordinati in modo crescente e separati da un "_"
\`\`\`

---

💡 Vantaggi dei file .spec.txt:
- L’AI capisce ${chalk.cyan('come formattare i valori')}
- Il tuo team capisce ${chalk.cyan('come è strutturata la tabella')}
- Usi standard chiari e condivisi nel progetto

`)
}


export {
    printDifferences,
}
