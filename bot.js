const {
  Client,
  RichEmbed
} = require('discord.js');
const client = new Client();
const spawn = require("child_process").spawn;
const emojis = require("./emoji").alphabet;
const fs = require('fs');
var mymaster = null;
var me = null;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.fetchUser("387267678408146946").then(function(user) {
    mymaster = user;
  });
  me = client.user;
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
  if (text.startsWith ("!") && false) {
    channel.send("NO")
  } else if (text.startsWith('!helpmewithalgebra')) {
    text = text.substring(18)
    var pyProg = spawn('python', ["./relational_algebra.py", text]);
    pyProg.stdout.on('data', function (data) {
      data = data.toString('utf8');
      channel.send("```xml\n" + data + "\n```");
      reacttomessage(message, "DONE")
    });
  } else if (text.startsWith('!about') || text.startsWith('!help')) {
    message.delete()
    const embed = new RichEmbed()
      .setTitle("i'm bot made by Alex!")
      .setColor(0x00FF00)
      .setDescription("Here is what i can do:")
      .addField("!about", "Show information anout me", true)
      .addField("!poll", "Create quick YES/NO poll (beta)", true)
      .addField("!helpmewithalgebra", "Converts SQL query to relational algebra model (beta)", true)
      .addField("!react", "Adds your word as emoji letter reactions to previous message", true)
      .addField("!quote", "Inserts a random quote from a movie", true)
      .addField("!suggest", "Any ideas?", true)
      .setAuthor("Alex Tsernoh", mymaster.avatarURL, "http://www.facebook.com/alex.tsernoh")
      .setFooter("My source: https://github.com/ProstoSanja/DiscordJankBot   Feel free to contribute!", me.avatarURL);
    message.author.send(embed);
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
  } else if (text.startsWith("!poll")) {
    reacttomessage(message, "[]")
  } else if (text.startsWith("!suggest") && message.author != me) {
    message.delete();
    mymaster.send(text + " ||| " + message.author.username)
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