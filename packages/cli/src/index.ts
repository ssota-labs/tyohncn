import { Command } from "commander"
import { initCommand } from "./commands/init.js"
import { addCommand } from "./commands/add.js"
import { applyCommand } from "./commands/apply.js"
import { listCommand } from "./commands/list.js"
import { studioCommand } from "./commands/studio.js"
import { packCommand } from "./commands/pack.js"

const program = new Command()

program
  .name("tyohncn")
  .description(
    "External-style component CLI — keeps cn-* hooks and installs style CSS"
  )
  .version("0.1.0")

program.addCommand(initCommand)
program.addCommand(addCommand)
program.addCommand(applyCommand)
program.addCommand(listCommand)
program.addCommand(studioCommand)
program.addCommand(packCommand)

program.parse()
