const Discord = require("discord.js");
const tokenfile = require("./tokenfile.json");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({disableEveryone: true});
const superagent = require("superagent");

const { Player, Queue } = require("discord-player");

const player = new Player(bot);
bot.player = player;

bot.player.on("trackStart", (message, track) => message.channel.send(`Most megy: ${track.title}`))
bot.player.on("trackAdd", (message, track, queue) => message.channel.send(`${message.content.split(" ").slice(1).join(" ")} hozá lett adva a váro listához.`))

let botname = "Teszt bot"

bot.on("ready", async() => {
    console.log(`${bot.user.username} elindult!`)

    let státuszok = [
        "Prefix: !",
        "Készítő: Varázssüti#1407",
        "menő :D"
    ]

    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        bot.user.setActivity(status, {type: "WATCHING"})
    }, 3000)
})

bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = botconfig.prefix;

    if(cmd === `${prefix}hello`){
        message.delete()
        message.channel.send("Sziasztok!");
    }


    if(cmd === `${prefix}help`){
        let TesztEmbed = new Discord.MessageEmbed()
        .setColor("#98AA12")
        .setAuthor(message.author.username)
        .setTitle("Prefix:")
        .addField("Admin parancsok:", "ban\n kick\n clear")
        .addField("Szorakozásra alkalmas parancsok:", "hug\n kiss\n pp\n jail\n szöveg\n ship\n avatar")
        .addField("Zene parancsok:", "play\n skip\n stop")
        .addField("NSFW parancsok:", "hentai\n fuck")
        .setThumbnail(message.author.displayAvatarURL())
        .setImage(message.guild.iconURL())
        .setDescription(`\`${prefix}\``)
        .setFooter(`${botname} | ${message.createdAt}`)

        message.channel.send(TesztEmbed)
    }

    if(cmd === `${prefix}avatar`){
        let TesztEmbed = new Discord.MessageEmbed()
        .setColor("#98AA12")
        .setAuthor(message.author.username)
        .setThumbnail(message.author.displayAvatarURL())

        message.channel.send(TesztEmbed)
    }

    if(cmd === `${prefix}szöveg`){
        message.delete()
        let szöveg = args.join(" ");

        if(szöveg) {
            let dumaEmbed = new Discord.MessageEmbed()
        .setColor("#98AA12")
        .setAuthor(message.author.username)
        .addField("Szöveg:", szöveg)
        .setFooter(`${botname} | ${message.createdAt}`)
    
        message.channel.send(dumaEmbed)
        } else {
            message.reply("írj szöveget!")
        }
    }

    if(cmd === `${prefix}kick`){
        message.delete()
        let kick_user = message.mentions.members.first();
        if (!message.member.hasPermission("BAN_MEMBERS"))            return message.reply("HIBA! **Nincs jogod ehhez a parancshoz! Szükséges jog:** `Tagok kitiltása`")
        if(args[0] && kick_user){

            if(args[1]){

                let KickEmbed = new Discord.MessageEmbed()
                .setTitle("KICK")
                .setColor("RED")
                .setDescription(`**Kickelte:** ${message.author.tag}\n**Kickelve lett:** ${kick_user.user.tag}\n**Kick indoka:** ${args.slice(1).join(" ")}`)

            message.channel.send(KickEmbed);

                kick_user.kick(args.slice(1).join(" "));

            } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "˘˘˘")
            .setColor("BLUE")
            .setDescription("HIBA: Kérlek adj meg egy indokot!!")

            message.channel.send(parancsEmbed);
            }

        } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "˘˘˘")
            .setColor("BLUE")
            .setDescription("HIBA: Kérlek említs meg egy embert!")

            message.channel.send(parancsEmbed);

        }
    }

    if(cmd === `${prefix}ban`) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let rawreason = args[2];
        let bantime = args[1];
        let reason = args.slice(2).join(' ')
        if (!message.member.hasPermission("BAN_MEMBERS"))            return message.reply("HIBA! **Nincs jogod ehhez a parancshoz! Szükséges jog:** `Tagok kitiltása`")
        if(!args[0] || !args[1] || !args[2] || isNaN(bantime)) return message.reply("HIBA! **Helyes használat: {prefix}ban <@felhasználó> [idő{(nap) max 7} <indok>**");
        if (user.hasPermission("BAN_MEMBERS") || user.hasPermission("ADMINISTRATOR")) return message.reply("HIBA! **Magaddal egyen rangú tagot, vagy nagyobbat nem bannolhatsz ki!**");
        if(user.ban({days: bantime, reason: reason})) {
            message.reply("**Sikeresen kitiltottad a következő felhasználót:** (" + user.user.tag + ")")
        } else {
            message.reply("HIBA! **Nincs jogom bannolni ezt az embert.**");
        }
    }

    if(cmd === `${prefix}jail`) { 
        if(!args[0]) return message.reply("Említs meg egy felhasználót!");
        let jail_user = message.mentions.members.first() || message.author
        let link = `https://some-random-api.ml/canvas/jail/?avatar=${jail_user.user.avatarURL({ format: 'png' })}`
        let attachment = new Discord.MessageAttachment(link, 'jail.png');
        let embed = new Discord.MessageEmbed()
        .setTitle(`Profilkép`)
        .setColor(`RANDOM`)
        .attachFiles(attachment)
        .setImage('attachment://jail.png')
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp();
        
        message.channel.send(embed)
    }

    if(cmd === `${prefix}clear`){
        if(message.member.hasPermission("KICK_MEMBERS")){
            if(message.guild.member(bot.user).hasPermission("ADMINISTRATOR")){
                
                if(args[0] && isNaN(args[0]) && args[0] <= 100 || 0 < args[0] && args[0] < 101){
                   
                    message.channel.send(`Törölve let: ${Math.round(args[0])} üzenet`)
                    message.channel.bulkDelete(Math.round(args[0]))

                }else {
                    message.reply(`Használat: ${prefix}clear <1-100>`)
                }

            }else message.reply("A botnak adminak kell lenie ezen a szerveren, hogy működjön ez a parancs!")

        }else message.reply("Ehez a parancshoz nincs jogod!")
    }

    if(cmd === `${prefix}ship`){
        if (!args[0]) return message.channel.send("Helytelen használat! Használat: !!ship <@név1> <@név2>")
        if (!args[1]) return message.channel.send("Helytelen használat! Használat: !!ship <@név1> <@név2>")
        
        if (args[0] || args[1]) {
            let FirstUser = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            let SecondUser = message.mentions.members.first(-1) || message.guild.members.cache.get(args[1])
            let sum = Math.floor(Math.random() * 100 ) + 1;
        
            if (!FirstUser) return message.channel.send(`Nem találok ilyen nevű felhasználót! **${args[0]}**!`)
            if (!SecondUser) return message.channel.send(`Nem találok ilyen nevű felhasználót!**${args[1]}**!`)
        // Sziaelló amúgy nem baj ha benn maradok itt AnyDesken? Nem, nem baj
            if (FirstUser || SecondUser) {
                const FirstUserSliced = FirstUser.user.username.slice(0, FirstUser.user.username.length / 2)
                const SecondUserSliced = SecondUser.map(user => { return user.user.username.slice(user.user.username.length / 2) })
                const SecondUserName = SecondUser.map(user => { return user.user.username })
        
                message.channel.send(`${sum}%-ban vagytok belezúgva egymásba! Gyereketek neve: **${FirstUserSliced}${SecondUserSliced}**`)
            }
          }
    } 
    if(cmd === `${prefix}kiss`){
        if(!args[0]) return message.reply("Említs meg egy felhasználót!");
        let pay_user = message.mentions.members.first();
     
        let kissgif = [
            'https://media2.giphy.com/media/G3va31oEEnIkM/giphy.gif',
            'https://media1.tenor.com/images/f5167c56b1cca2814f9eca99c4f4fab8/tenor.gif?itemid=6155657',
            'https://media.tenor.com/images/fbb2b4d5c673ffcf8ec35e4652084c2a/tenor.gif',
            'https://media.giphy.com/media/oHZPerDaubltu/giphy.gif',
            'https://acegif.com/wp-content/uploads/anime-kiss-m.gif',
            'https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif',
            'https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif',
            'https://media.giphy.com/media/KH1CTZtw1iP3W/source.gif'
        
        ]
        let random_kissgif = Math.floor(Math.random()*kissgif.length)
        
     
     
        message.channel.send(`${message.author.username}` + ' meg puszilta ' + `<@${pay_user.id}>`)
        message.channel.send(`${kissgif[random_kissgif]}`)
    }

    if(cmd === `${prefix}hug`){
        if(!args[0]) return message.reply("Említs meg egy felhasználót!");
        let pay_user = message.mentions.members.first();
       
        let huggif = [
            'https://media.giphy.com/media/PHZ7v9tfQu0o0/giphy.gif',
            'https://media.giphy.com/media/GMFUrC8E8aWoo/giphy.gif',
            'https://media.giphy.com/media/QFPoctlgZ5s0E/giphy.gif',
            'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
            'https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.gif',
            'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif',
            'https://media.giphy.com/media/LIqFOpO9Qh0uA/giphy.gif',
            'https://media.giphy.com/media/ArLxZ4PebH2Ug/giphy.gif'
        
        ]
        let random_huggif = Math.floor(Math.random()*huggif.length)
        
     
     
        message.channel.send(`${message.author.username}` + ' meg ölelte ' + `<@${pay_user.id}>`)
        message.channel.send(`${huggif[random_huggif]}`)
    }

    if(cmd === `${prefix}bonk`){
        if(!args[0]) return message.reply("Említs meg egy felhasználót!");
        let pay_user = message.mentions.members.first();
       
        let bonkgif = [
            'https://media.giphy.com/media/qgVnduXSn5Hy7DbW3r/giphy.gif',
            'https://media.giphy.com/media/qgVnduXSn5Hy7DbW3r/giphy.gif',
            'https://media.giphy.com/media//giphy.gif'

        ]
        let random_bonkgif = Math.floor(Math.random()*bonkgif.length)
        
     
     
        message.channel.send(`${message.author.username}` + ' fejbe baszta ' + `<@${pay_user.id}>`)
        message.channel.send(`${bonkgif[random_bonkgif]}`)
    }

})

bot.on("message", async(message) => {
    let prefix = botconfig.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "play"){
        if(!message.member.voice.channel) return message.reply("Nem vagy bent egy voice csatornában sem!")
        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("Nem vagy velem egy voice csatorában!")
        if(!args[0]) return message.reply("Adj meg egy URL linket vagy zene cimet!")

        bot.player.play(message, args.join(" "), {firstResult: true});
    }
    if(command === "queue"){
        if(!message.member.voice.channel) return message.reply("Nem vagy bent egy voice csatornában sem!")
        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("Nem vagy velem egy voice csatorában!")
        
        const queue = bot.player.getQueue(message);

        if(!bot.player.getQueue(message)) return message.reply("A várolistán nem szerepel semmi!")

        message.channel.send(`**Várolista - ${message.guild.name}\nJelenleg ${queue.playing.title} | ${queue.playing.title}\n\n` + (queue.track.map((track, i) => {
            return `**#${i + 1}** - ${track.title} | ${track.author} (A zenét kérte: ${track.requestedBy.username})`

        }).slice(0, 5).join(`\n`) + `\n\n${queue.track.length > 5 ? `és még **${queue.track.length - 5}db zene...` : `A lejátszási listában: **${queue.track.length}db zene van.`}`
         ));

    }
    if(command === 'skip') {
        if(!message.member.voice.channel) return message.reply("Nem vagy bent egy voice csatornában sem!")
        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("Nem vagy velem egy voice csatorában!")
        if(!bot.player.isPlaying(message)) return message.reply("Nincs mit kihagyni!")

        bot.player.skip(message);
        message.channel.send("Zene kihagyva!");
    }
    if(command === 'stop') {
        if(!message.member.voice.channel) return message.reply("Nem vagy bent egy voice csatornában sem!")
        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("Nem vagy velem egy voice csatorában!")
        if(!bot.player.isPlaying(message)) return message.reply("Jelenleg nem megy zene!")

        bot.player.stop(message);
        message.channel.send("Zene meg állitva!");
    }

})

bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = botconfig.prefix;

    if(cmd === `${prefix}hentai`) {
        
        let {body} = await superagent
        .get(`https://nekos.life/api/v2/img/Random_hentai_gif`);
        if (!message.channel.nsfw) { 
        message.reply("Ez nem Nfsw csatorna!!!")
        message.react('💢');
        return;
       }
        let hentaiEmbed = new Discord.MessageEmbed()
        .setTitle("Hentai")
        .setImage(body.url)
        .setColor("#FF0000")
    
        message.channel.send(hentaiEmbed);
    }
    
     if(cmd === `${prefix}fuck`) {
        if(!args[0]) return message.reply("Említs meg egy felhasználót!");

        let {body} = await superagent
        .get(`https://nekos.life/api/v2/img/Random_hentai_gif`);
        if (!message.channel.nsfw) { 
        message.reply("Ez nem Nfsw csatorna!!!")
        message.react('💢');
        return;
       }
       let pay_user = message.mentions.members.first();
       message.channel.send(`${message.author.username}` + ' meg baszta ' + `<@${pay_user.id}>`)
       let hentaiEmbed = new Discord.MessageEmbed()
        .setImage(body.url)
        .setColor("#FF0000")
    
        message.channel.send(hentaiEmbed);
    }

    if(cmd === `${prefix}pp`) {

        if(!args[0]) return message.reply("Említs meg egy felhasználót!");
        let faszméret = Math.floor(Math.random()*69 + 0)
        let First_User = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        message.channel.send(`<@${First_User.id}> fasza ${faszméret}-cm.`)

    }

})



bot.login(tokenfile.token);