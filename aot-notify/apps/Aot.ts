//TODO: Implement DB
import * as express from 'express';
import cheerio from 'cheerio';

import config from '../utils/Config';
import aotConfig from '../utils/aot/Config';

import fs from 'fs';

import { Logger } from '../utils/Logger';
import { OldFicData } from '../utils/aot/Interfaces';
const logger = new Logger("aot-notify", "#ea513c")

export default class AotController {
    public basePath = '/aot';
    public router = express.Router();

    public constructor() {
        this.initRoutes();
        if (aotConfig.notify.enable == true) this.initWatcher(aotConfig.notify.interval);
    }

    private initWatcher(ms: number) {
        logger.start(`Started Fic Watcher. Checking every ${ms}ms!`)
        const ficWatch = setInterval(this.watcher, ms)
    }

    private async watcher() {
        // Read data:
        let oldData: OldFicData[] = JSON.parse(fs.readFileSync("./src/data/aot/oldData.json").toString());
        let newData: object[] = [];

        for (let fic of oldData)  {
            let currentData = await new AotScraper(fic.id).data;
            if (currentData.last_chapter_code != fic.last_chapter_code) {
                await new DiscordNotify(currentData).send();
                newData.push({id: fic.id, last_chapter_code: currentData.last_chapter_code})
                continue
            }
            newData.push(fic)
        }
        // Write data:
        fs.writeFileSync("./src/data/aot/oldData.json", JSON.stringify(newData));
        
    }

    private initRoutes() {
        this.router.get(this.basePath, this.index);
        this.router.get(`${this.basePath}/ficInfo/:code`, this.ficInfo);
        this.router.get(`${this.basePath}/notify/:code`, this.notify);
    }

    index = async (request: express.Request, response: express.Response) => {
        response.send(`AOT Status: ${(await fetch("https://archiveofourown.org")).statusText}`)
    }

    ficInfo = async (request: express.Request, response: express.Response) => {
        response.send(await new AotScraper(request.params.code).data)
    }

    notify = async (request: express.Request, response: express.Response) => {
        await new DiscordNotify(await new AotScraper(request.params.code).data).send()
        response.status(202).send("<h1><b>(≧з≦)b</b></h2><br> All good!")
    }
}

class AotScraper {
    public code: string;
    public url: string;
    public data: any;

    public constructor(code: string) {
        this.code = code;
        this.url = `https://archiveofourown.org/works/${this.code}?view_adult=true`;
        this.data = this.scrape();
    };

    private async scrape() {
        let html = await (await fetch(this.url, {headers:{cookie: 'view_adult=true;'}, credentials:'include'})).text()
        const $ = cheerio.load(html)
        return {
            id: this.code,
            title: $('h2.title').text().trim(), // <h2 class=title> *** </h2>
            author: $('a[rel="author"]').text(), // <a rel="author"> *** </a>
            author_link: `https://archiveofourown.org${$('a[rel="author"]').attr('href')}`,
            published: $('dd.published').text(),
            updated: $('dd.status').text(),
            word_count: $('dd.words').text(),
            chapter_count: $('dd.chapters').text(),
            last_chapter_code: $('option').last().attr('value'),
            last_chapter_url: `https://archiveofourown.org/works/38700753/chapters/${$('option').last().attr('value')}`,
            summary: $('.userstuff').eq(0).text().trim(),
        }
    }
}

class DiscordNotify {
    public data: any;

    public constructor(data) {
        this.data = data
    };

    public async send() {
        await fetch(`https://${config.api.url}/notify/discord/${aotConfig.notify.discord.webhook_id}/${aotConfig.notify.discord.webhook_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.data.title,
                description: `${this.data.summary.substring(0, 200)} (...)`,
                url: `https://archiveofourown.org/${this.data.id}?view_adult=true`,
                color: 14828084,
                footer: {
                    text: "✨ via qilin-api",
                    icon_url: "https://cdn.discordapp.com/icons/1011678461288517723/2e5c46e43ba572f67ef82a58023385b8.webp?size=128"
                },
                thumbnail: {
                    url: "https://duckduckgo.com/i/9956ab8e.png"
                },
                author: {
                    name: this.data.author,
                    url: this.data.author_link
                },
                fields: [{
                    name: `New Chapter! (${this.data.chapter_count})`,
                    value: this.data.last_chapter_url,
                    inline: true
                }] 
            })
        })
    }


}