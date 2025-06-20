import chalk from "chalk"
import { llm, LLM_API_baseUrl } from "../objects"

function printAppInformations() {

    console.log(`
${chalk.bgBlue('                                 ')}
${chalk.bgBlue(chalk.white('    Informazioni sul software    '))}
${chalk.bgBlue('                                 ')}

${chalk.white('Versione')}  : ${chalk.cyanBright('1.0.0')}
${chalk.white('Autore')}    : ${chalk.bgGray(chalk.rgb(255,0,0)(' Alessio S. '))}
${chalk.white('LLM usato')} : ${chalk.rgb(0, 255, 0)(llm)}
${chalk.white('API AI')}    : ${chalk.rgb(255, 0, 255)(LLM_API_baseUrl)}

`)

}

export {
    printAppInformations,
}
