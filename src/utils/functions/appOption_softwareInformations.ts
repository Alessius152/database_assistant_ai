import chalk from "chalk"

function printAppInformations(){

    console.log(`
${chalk.bgBlue            ('                                 ')}
${chalk.bgBlue(chalk.white('    Informazioni sul software    '))}
${chalk.bgBlue            ('                                 ')}

${chalk.white('Versione')} : ${chalk.cyanBright('1.0.0')}
${chalk.white('Autore')}   : ${chalk.grey(chalk.cyanBright('Alessio S.'))}

`)

}

export {
    printAppInformations,
}
