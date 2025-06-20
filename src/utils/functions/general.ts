import chalk from 'chalk'
import inquirer from 'inquirer'
import cp from 'child_process'
import { appOption_dbAccessDifferences, appOption_dbPopulation, appOption_softwareInformations } from './menuOptions'
import { CustomizedInquirerOption } from '../types'
import FileTreeSelectionPrompt from 'inquirer-file-tree-selection-prompt'

inquirer.registerPrompt('file-tree-selection', FileTreeSelectionPrompt)

async function inputChoiceFromList<T extends string>(msg: string, ...choices: Array<T>): Promise<T> {

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

async function inputChoiceFromListCustomized<TLabel extends string>(msg: string, ...choices: Array<CustomizedInquirerOption<TLabel>>): Promise<TLabel> {

    const answer = await inquirer.prompt<{ choice: TLabel }>([
        {
            type: 'list',
            name: 'choice',
            message: msg,
            choices: choices.map(({ color, label }) => {
                const colorFn = (chalk as any)[color] ?? chalk.white;
                return {
                    name: colorFn(label),
                    value: label,
                }
            }),
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

async function chooseDirectory() {
    const choice = await inquirer.prompt([
        {
            type: 'file-tree-selection',
            name: 'endpoint',
            root: 'c:/',
            onlyShowDir: true,
        }
    ])

    return choice.endpoint
}

const cli = {
    clear: () => {
        if (process.platform === 'win32') {
            cp.execSync('cls', { stdio: 'inherit' })
        } 
        else if (process.platform === 'linux') {
            cp.execSync('clear', { stdio: 'inherit' })
        }
    },
    pause: async () => {
        await inputString(chalk.bgWhite(chalk.redBright(" Premi INVIO per continuare ")))
    },
    error: (msg: string)=>{
        return console.log(chalk.bgRedBright(chalk.white(msg)))
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
    inputChoiceFromList,
    inputChoiceFromListCustomized,
    inputString,
    chooseDirectory,
    cli,
    menu,
}
