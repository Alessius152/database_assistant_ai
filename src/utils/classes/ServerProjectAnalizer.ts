import { cli } from "../functions/general"
import { BackendLanguage, NodeOrmName, OrmNamesMap, PhpOrmName } from "../types"

class ServerProjectAnalizer<L extends BackendLanguage> {

    constructor(
        private readonly language: L,
        private readonly orm: OrmNamesMap[L]
    ) {
        if(language === 'NodeJS'){
            
            if(orm === "Sequelize"){}

            // else if(orm === 'TypeORM'){}
            // else if(orm === 'Prisma'){}
            // else if(orm === 'Objection.js'){}
            else {
                cli.error("ORM non supportato")
                return
            }

        }
        // else if(language === 'PHP'){}
        else {
            cli.error("Linguaggio non supportato")
        }
    }

}

export {
    ServerProjectAnalizer,
}
