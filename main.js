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
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    // check if the commandgiver has the role that permits using the command.
    if(message.content.startsWith(prefix) && !message.member.roles.cache.find(r => r.name === permittedRole))
    {
        message.channel.send("You do not have permission to use that command. You have no power here");
        return;
    }

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

        // init variables
        var target;
        var isValidName = true;
        var isAgartek = false;
        var repeats;
        var intervalStart;
        var intervalEnd;
        
        members
        // set target
        .then(memberCollection => {target = memberCollection.at(0);})
        // check if the given target name is valid.
        .then(member => {
            if (target == undefined)
            {
                isValidName = false;
            } 
            console.log("isValidName: " + isValidName);
        })
        .then(unUsed => {
            if (isValidName)
            {
                // check if trying to kick agartek
                if (target.user.username == "agartek") isAgartek = true;
                console.log("is agartek? " + isAgartek);
                
                // define repeats and interval
                if (!isAgartek)
                {
                    //repeats
                    if (args[1] == " ")
                    {
                        repeats = getRndInteger(3, 5);
                    }
                    else
                    {
                        repeatsParts = args[1].split("-");
                        if (repeatsParts.length == 1)
                        {
                            repeats = repeatsParts[0];
                        }
                        else
                        {
                            repeats = getRndInteger(repeatsParts[0], repeatsParts[1]);
                        }
                    }
                    console.log("repeats: " + repeats);
                    
                    //interval
                    if (args[2] == " " || args[2] == "")
                    {
                        intervalStart = 3000;
                        intervalEnd = 10000;
                    }
                    else
                    {
                        intervalParts = args[2].split("-");
                        if (intervalParts.length == 1)
                        {
                            intervalStart = intervalParts[0]*1000;
                            intervalEnd = intervalParts[0]*1000;
                        }
                        else
                        {
                            intervalStart = intervalParts[0]*1000;
                            intervalEnd = intervalParts[1]*1000;
                        }
                    }
                    console.log("intervalStart: " + intervalStart);
                    console.log("intervalEnd: " + intervalEnd)
                    console.log(message.author.username + " kicked " + target.user.username + " " + repeats + " times with an interval of " + intervalStart/1000 + "-" + intervalEnd/1000 + " seconds");
                }
                else
                {
                    message.channel.send("You just tried to kick someone smarter, better, stronger, taller, funnier than yourself. Don't do that.");
                    console.log(message.author.username + " just tried to kick agartek. What a monkey.")
                }
            }
            else{
                message.channel.send("Member not found.")
            }
        })
        .then(unUsed => {
            if (isValidName && !isAgartek)
            {
                disconnectAndWait(repeats, target, intervalStart, intervalEnd);
            }
        });
    }
})

// get random integer between min and max, min and max inclusive.
function getRndInteger(min, max) 
{
    return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
}

// kicks target 'repeats' times. toBeKicked is a promise<guildMember>
async function disconnectAndWait(repeatcounter, toBeKicked, millisecondsStart, millisecondsEnd)
{
    // disconnect target
    toBeKicked.voice.disconnect();
    // generate a random amount of milliseconds between 3000 and 20000 to wait.
    var milliseconds = getRndInteger(millisecondsStart, millisecondsEnd);
    await delay(milliseconds);
    console.log(milliseconds/1000 + " seconds just passed!");
    repeatcounter = repeatcounter - 1;
    // calls itself again if repeats is not 0. As repeats gets decremented every time disconnectAndWait is run, it will eventually stop.
    if (repeatcounter > 0)
    {
        disconnectAndWait(repeatcounter, toBeKicked, millisecondsStart, millisecondsEnd);
    }
}

// wait 'millis' milliseconds
const delay = millis => new Promise((resolve, reject) => 
{
  setTimeout(_ => resolve(), millis)
});
// login to bot. Bot token found on discord developer portal
client.login('OTM1MzQwOTQ2NDgzMTg3NzQy.Ye9OIw.PMaAum62hzIRyffMdPYiOw9IqPw');