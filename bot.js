const {
  Client,
  RichEmbed
} = require('discord.js');
const client = new Client();
const spawn = require("child_process").spawn;
const emojis = require("./emoji").alphabet;
const fs = require('fs');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  //if (!message.guild) return;
  text = message.content;
  if (text=="") {
    return;
  }
  channel = message.channel;
  console.log(text)

  // If the message content starts with "!kick"
  if (text.startsWith('!helpmewithalgebra')) {
    text = text.substring(18)
    var pyProg = spawn('python', ["./relational_algebra.py", text]);
    pyProg.stdout.on('data', function (data) {
      data = data.toString('utf8');
      channel.send("```css\n" + data + "\n```");
      reacttomessage(message, "DONE")
    });
  } else if (text.startsWith('!about') || text.startsWith('!help')) {
    const embed = new RichEmbed()
      .setTitle("i'm bot made by Alex!")
      .setColor(0xFF0000)
      .setDescription("Currently available commands:\n\n!about or !help: show information about me\n!helpmewithalgebra: Converts SQL query to relational algebra");
    channel.send(embed);
  } else if (text.startsWith('!react ')) {
    text = text.substring(7).toUpperCase();
    message.delete()
    channel.fetchMessages({limit:1, before: message.id}).then(function(messages) {
      for (var entry of messages.entries()) {
        reacttomessage(entry[1], text)   
      }   
    })
  } else if (text.startsWith('!quote')) {
    message.delete();
    fs.readFile('./quotes.txt', 'utf8', function(err, contents) {
      contents = contents.split("\n");
      message.channel.send('`' + contents[Math.floor(Math.random()*contents.length)] + '`');
    });
  }
});

function reacttomessage(message, reaction) {
  if (reaction.length > 0) {
    message.react(emojis[reaction.charAt(0)]).then(function() {
      return reacttomessage(message, reaction.substring(1))
    })
  }
}



client.login(require("./secret"));