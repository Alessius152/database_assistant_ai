import { cli, menu } from "./utils/functions/general"

main()

async function main() {

    while (true) {

        cli.clear()
        menu.printWelcome()

        await menu.processChoice(
            (await menu.nextChoice()).todo
        )

        await cli.pause()

    }

}
