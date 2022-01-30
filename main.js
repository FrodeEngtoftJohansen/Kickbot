// made based on:
// Basics: https://www.youtube.com/watch?v=j_sD9udZnCk
// Basic command handler: https://www.youtube.com/watch?v=nTGtiCC3iQM 

const Discord = require('discord.js');

// intents
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });

// prefix - sign before commands
const prefix = '+';

// only members with permitted role can use commands
var permittedRole = "ゴゴゴゴゴゴゴゴ"

// tell the console when the bot is online
client.once('ready', () => {
    console.log('Kickbot is online!');
});

// when a message is sent, check if it starts with prefix and is not sent by a bot.
client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot || !message.member.roles.cache.find(r => r.name === permittedRole)) return;

    // split message into array of arguments
    const args = message.content.slice(prefix.length).split(",");
    const command = args.shift().toLowerCase();

    console.log('|-------------------------------------------------------------------------------------------------------------|')
    console.log('args: ' + args);
    console.log('command: ' + command);
    // test command
    if(command == 'args'){
        message.channel.send(args[0]);
    }
    // kick target from voice channels between x and y times. each kick happens 3-20 seconds after each other.
    else if(command == 'kick' && args.length >= 1){
        // check if member on server
        const members = message.guild.members.fetch({query: args[0], limit: 1});

        var member = members.then(memberCollection => {return memberCollection.at(0);});

        // error message if member not found on server
        member.then(guildMember => {return guildMember.user.username})
        .catch(err => {message.channel.send('Member not found.');})
        // log who kicked who
        .then(targetUsername => {member.then(guildMember => {console.log(message.author.username + " kicked " + targetUsername);})});
        
        //check if trying to kick agartek.
        //member.then(isAgartek => {if(member.user.username == "agartek"){message.channel.send("You just tried to kick someone smarter, better, stronger, taller, funnier than yourself. Don't do that.");}})
        //.catch(unUsed =>{message.channel.send("an error was made")});
        // kick target repeatedly
        member.then(notUsed => {
        var repeats = 0;
        //console.log("args length: " + args.length);
        // assign repeats a length depending how many arguments received.
        if (args.length == 1)
        {
            repeats = getRndInteger(3, 5);
        }
        else if (args.length == 2)
        {
            repeats = args[1];
        }
        else
        {
            repeats = getRndInteger(Number(args[1]), Number(args[2]));
        }
        console.log("repeats: " + repeats);
        // disconnect target repeats times.
        disconnectAndWait(repeats, member);
        })   
    }
})
// get random integer between min and max, min and max inclusive.
function getRndInteger(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// kicks target 'repeats' times. toBeKicked is a promise<guildMember>
async function disconnectAndWait(repeats, toBeKicked)
{
    // disconnect target
    toBeKicked.then(guildMember => {guildMember.voice.disconnect()})
    .catch(unUsed =>{});
    // generate a random amount of milliseconds between 3000 and 20000 to wait.
    var milliseconds = getRndInteger(3000, 20000);
    await delay(milliseconds);
    console.log(milliseconds/1000 + " seconds just passed!");
    repeats = repeats - 1;
    // calls itself again if repeats is not 0. As repeats gets decremented every time disconnectAndWait is run, it will eventually stop.
    if (repeats > 0)
    {
        disconnectAndWait(repeats, toBeKicked);
    }
}

// wait 'millis' milliseconds
const delay = millis => new Promise((resolve, reject) => 
{
  setTimeout(_ => resolve(), millis)
});
// login to bot. Bot token found on discord developer portal
client.login('OTM1MzQwOTQ2NDgzMTg3NzQy.Ye9OIw.bnppASgdwhJm8H_-psnLCnREOLw');