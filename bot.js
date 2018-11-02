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
  client.fetchUser("387267678408146946").then(function (user) {
    mymaster = user;
  });
  me = client.user;
});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  //if (!message.guild) return;
  text = message.content.trim();
  if (text == "" || message.author == me) {
    return;
  }
  channel = message.channel;
  console.log(text);

  // If the message content starts with "!kick"
  if (text.startsWith("!") && false) {
    channel.send("NO");
  } else if (text.startsWith('!helpmewithalgebra')) {
    text = text.substring(18);
    var pyProg = spawn('python', ["./relational_algebra.py", text]);
    pyProg.stdout.on('data', function (data) {
      data = data.toString('utf8');
      channel.send("```xml\n" + data + "\n```");
      reacttomessage(message, "DONE");
    });
  } else if (text.startsWith('!about') || text.startsWith('!help')) {
    message.delete();
    const embed = new RichEmbed()
      .setTitle("i'm bot made by Alex!")
      .setColor(0x00FF00)
      .setDescription("Here is what i can do:")
      .addField("!about", "Show information about me", true)
      .addField("!poll", "Create quick YES/NO poll (beta)", true)
      .addField("!helpmewithalgebra", "Converts SQL query to relational algebra model (beta)", true)
      .addField("!react", "Adds your word as emoji letter reactions to previous message", true)
      .addField("!bigtext", "Prints givenn text in emoji letters", true)
      .addField("!quote", "Inserts a random quote from a movie", true)
      .addField("!:ab:ortnite", "Suprise for your friends in a voice chat", true)
      .addField("!suggest", "Any ideas?", true)
      .setAuthor("Alex Tsernoh", mymaster.avatarURL, "http://www.facebook.com/alex.tsernoh")
      .setFooter("My source: https://github.com/ProstoSanja/DiscordJankBot   Feel free to contribute!", me.avatarURL);
    message.author.send(embed);
  } else if (text.startsWith('!react')) {
    message.delete();
    text = text.substring(6).toUpperCase().trim();
    channel.fetchMessages({
      limit: 1,
      before: message.id
    }).then(function (messages) {
      for (var entry of messages.entries()) {
        if (text.startsWith("<")) {
          text=text.substring(2);
          text = text.substring(text.indexOf(":")+1, text.length-1);
          entry[1].react(message.guild.emojis.get(text));
        } else {
          text = text.replace(" ", "");
          reacttomessage(entry[1], text)
        }
      }
    });
  } else if (text.startsWith('!quote')) {
    message.delete();
    fs.readFile('./quotes.txt', 'utf8', function (err, contents) {
      contents = contents.split("\n");
      message.reply('`' + contents[Math.floor(Math.random() * contents.length)] + '`');
    });
  } else if (text.startsWith("!voteall///")) {
    message.delete();
    text = text.substring(8).trim();
    message.guild.channels.get("505347340014714880").send("@everyone " + text)
      .then(message => reacttomessage(message, "[]"));
  } else if (text.startsWith("!voteyacrs")) {
    reacttomessage(message, "ABCDE")
  } else if (text.startsWith("!poll") || text.startsWith("!vote")) {
    reacttomessage(message, "[]");
  } else if (text.startsWith("!suggest")) {
    message.delete();
    mymaster.send(text + " ||| " + message.author.username);
  } else if (text.startsWith("!bigtext")) {
    text = text.substring(8);
    message.delete();
    message.reply(transformtoemoji(text.toUpperCase()));
  } else if (text == "F" && false) {
    message.delete();
    message.reply(transformtoemoji("F"));    
  } else if (text.startsWith("!🆎ortnite")) {
    message.delete();
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join().then(connection => {
        const dispatcher = connection.playStream(fs.createReadStream('./abortnite.mp3'));
        dispatcher.setVolume(1);
        dispatcher.on('end', () => {
          connection.disconnect();
        });
        dispatcher.on('error', (e) => {
          connection.disconnect();
        });
      })
      .catch(console.log);
    }
  } else if (text.startsWith("!seat")) {
    text = text.substring(5).trim().split(" ");
    message.delete();
    if (text.size == 2) {
      var pyProg = spawn('python', ["./seating.py", message.author.username, text[0], text[1]]);
      pyProg.stdout.on('data', function (data) {
        data = data.toString('utf8');
      });
    }
    console.log(text);
  } else if (text.startsWith("!random")) {
    text = text.substring(text.indexOf("<@&")+3, text.indexOf(">"));
    people = Array.from(message.guild.roles.get(text).members);
    result = people[Math.floor(Math.random() * people.length)][1];
    console.log(result);
    channel.send("<@!" + result.id + ">");
    //console.log(Array.from(message.guild.members)[result][1]);
  }
});

function transformtoemoji(message) {
  newmessage = "";
  for (i = 0; i < message.length; i++) {
    char = emojis[message.charAt(i)];
    if (char) {
      newmessage += char + "\u200B";
    } else {
      newmessage += message.charAt(i);
    }
  }
  return newmessage;
}

function reacttomessage(message, reaction) {
  if (reaction.length > 0) {
    message.react(emojis[reaction.charAt(0)]).then(function () {
      return reacttomessage(message, reaction.substring(1));
    })
  }
}



client.login(require("./secret"));