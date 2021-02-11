import { exec } from "child_process";
import * as fs from "fs";
import * as archiver from "archiver";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getFilenameFriendlyTimestamp } from "../util/timestamps";
const config = require("../../config.json");

class ValheimServerCommand extends Command {
    constructor() {
        super('vhserver', {
           aliases: ['vhserver'],
           args: [
               {
                   id: 'action',
                   type: 'string',
                   default: 'status'
               },
               {
                   id: 'world',
                   type: 'string',
                   default: config.defaultValheimWorld
               }
           ]
        });
    }

    exec(message: Message, args: any) {
        switch (args.action) {
            case 'status': this.status(message); break;
            case 'start': this.start(message); break;
            case 'restart': this.restart(message); break;
            case 'stop': this.stop(message); break;
            case 'backup': this.backup(message, args.world); break;
        }
    }

    status(message: Message) {
        this.shell_exec(`bash ${config.vhserverPath} monitor`, (response: string) => { return message.channel.send(response) })
    }

    start(message: Message) {
        this.shell_exec(`bash ${config.vhserverPath} start`, (response: string) => { return message.channel.send(response) })
    }

    restart(message: Message) {
        this.shell_exec(`bash ${config.vhserverPath} restart`, (response: string) => { return message.channel.send(response) })
    }

    stop(message: Message) {
        this.shell_exec(`bash ${config.vhserverPath} stop`, (response: string) => { return message.channel.send(response) })
    }

    backup(message: Message, world: string) {
        const filename = `${world}-backup_${getFilenameFriendlyTimestamp()}.zip`;
        const filepath = `${config.valheimWorldsBackupPath}${filename}`;
        const output = fs.createWriteStream(filepath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        const extensions = ['db', 'db.old', 'fwl', 'fwl.old'];

        message.channel.send(`Starting backup for Valheim world ${world}...`);

        output.on('close', () => message.channel.send(`Backup complete. Download URL: ${config.valheimWorldsBackupBaseUrl}${filename}`));

        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                message.channel.send(err.message);
            } else {
                throw err;
            }
        });

        archive.on('error', err => {
            console.error(err);
            message.channel.send(err.message);
        });

        archive.pipe(output);
        extensions.forEach(ext => archive.glob(`${world}*.${ext}`, { cwd: config.valheimWorldsPath }));
        archive.finalize();
    }

    shell_exec(command: string, callback: (response: string) => void) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                callback(error.message);
                return;
            }

            if (stderr) {
                callback(stderr);
                return;
            }

            callback(stdout);
        });
    }
}

module.exports = ValheimServerCommand;