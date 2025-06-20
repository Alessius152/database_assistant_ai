import { executeRawAccess, executeServerProjectAccess, instructionsPrint } from "./appOption_dbPopulation"
import { DBAccessType } from "../types"
import { printDifferences } from "./appOption_dbAccessDifferences"
import { printAppInformations } from "./appOption_softwareInformations"
import { cli, inputChoiceFromList } from "./general"

function appOption_dbAccessDifferences() {
    printDifferences()
}

async function appOption_dbPopulation() {

    cli.clear()
    instructionsPrint()

    const accessType = await inputChoiceFromList<DBAccessType>('Come devo accedere al database?', 'raw-access', 'server-project')

    switch(accessType){
        case 'raw-access': return await executeRawAccess()
        case 'server-project': return await executeServerProjectAccess()
    }
}

function appOption_softwareInformations() {
    printAppInformations()
}

export {
    appOption_dbAccessDifferences,
    appOption_dbPopulation,
    appOption_softwareInformations,
}
