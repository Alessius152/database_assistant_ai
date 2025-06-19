import chalk from 'chalk'
import inquirer from 'inquirer'
import cp from 'child_process'
import { appOption_dbAccessDifferences, appOption_dbPopulation, appOption_softwareInformations } from './menuOptions'
import { inputString } from './appOption_dbPopulation'

const cli = {
    clear: () => {
        if (process.platform === 'win32') {
            cp.execSync('cls', { stdio: 'inherit' })
        } else {
            cp.execSync('clear', { stdio: 'inherit' })
        }
    },
    pause: async () => {
        await inputString(chalk.bgWhite(chalk.redBright(" Premi INVIO per continuare ")))
    }
}

const menu = {
    printWelcome: () => {
        console.log(chalk.cyan(`Database Population Automizer CLI`))
    },

    nextChoice: async () => {
        return await inquirer.prompt([
            {
                type: 'list',
                message: 'Scegli cosa fare',
                name: 'todo',
                choices: [
                    { name: 'DA LEGGERE: Differenza tra tipi di accesso raw-access e server-project', value: 0 },
                    { name: 'Popola database relazionale', value: 1 },
                    { name: 'Informazioni sul software', value: 2 },
                    { name: 'Chiudi', value: 2000 }
                ]
            }
        ])
    },

    processChoice: async (choice: number) => {
        switch (choice) {
            case 0:
                appOption_dbAccessDifferences()
                break

            case 1:
                await appOption_dbPopulation()
                break

            case 2:
                appOption_softwareInformations()
                break

            case 2000: return process.exit(0)

            default: return
        }
    }
}

export {
    cli,
    menu,
}
