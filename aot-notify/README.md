# aot-notify

*Note: This app (like qilin-api) doesn't have support for MongoDB yet.* <br>
*As soon as support is added in the api, this will be updated! For now, we use json... :pensive:*

<hr>

How to add this app to qilin:

**1.** Clone this repo:<br>
> git clone https://github.com/qilin-project/example-apps


**1.1.** Cd into the aot folder:<br>
> cd example-apps/aot-notify


**2.** Move `apps` and `utils/aot` to the `src` folder in your installation of qilin
> cp -r apps $qilin-install/src <br>
> cp -r utils/aot $qilin-install/src/utils/

**2.1.** (*Temporary*) Move `data/aot` into `src` folder in your installation of qilin. <br>
> cp -r data/aot $qilin-install/src/data/

**2.2.** To add new fics to the watcher:<br>
    ~ Edit `data/aot`. Append to the end of the array an object containing the id and last chapter code of the fic. e.g: <br>
         This: 
>[{"id":"38700753","last_chapter_code":"103818741"}] <br>

Into this:  

>[{"id":"38700753","last_chapter_code":"103818741"},{"id":"41275998", "last_chapter_code":"103952787"}]

**IMPORTANT: Do not copy/move ANYTHING ELSE. These files might be outdated and might break your qilin installation. They are only there so vscode doesn't scream at me and will only be updated when absolutely necessary! :)**

**3.** Edit `/utils/aot/Config.ts`. <br>
~ Add your discord webhook's id and token. <br>
~ By default the watcher is enabled and searches every 1 hour. If you want, change it.

**4.** Install dependencies: <br>
>bun install cheerio @types/node<br>
>(In your *qilin* installation, not in this repo!)


**5.** Done!

<hr>

*Feel free to modify the embeds to fit your server's style, just make sure to give credits :)*