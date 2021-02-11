import { AkairoClient, CommandHandler } from "discord-akairo";
const config = require("../config.json");

class SomeBotClient extends AkairoClient {
    commandHandler: CommandHandler;

    constructor() {
        super({
            ownerID: config.ownerID
        }, {
            disableMentions: "everyone"
        });

        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            prefix: '.'
        });

        this.commandHandler.loadAll();
    }
}

const client = new SomeBotClient();
client.login(config.token);