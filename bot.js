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
var infochat = null;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.fetchUser("387267678408146946").then(function (user) {
    mymaster = user;
  });
  me = client.user;
  infochat = client.channels.get("505347340014714880");
});

client.on('message', message => {
  text = message.content.trim().split(" ");
  if (text[0] == "" || !text[0].startsWith("!") || message.author == me) {
    return;
  }
  checkmessage(message, text);
});

function checkmessage(message, text) {
  console.log(text)
  switch(text[0]) {
    case "!about":
      about(message);
      break;
    case "!help":
      about(message);
      break;
    case "!quote":
      generatequote(message);
      break;
    case "!:ab:ortnite":
      playmusic(message, "abortnite");
      break;
    case "!despacito":
      playmusic(message, "despacito");
      break;
    case "!random":
      chooserandom(message, text[1]);
      break;
    case "!algebra":
      runprogr(message, "relational_algebra", text);
      break;
    case "!seat":
      runprogr(message, "relational_algebra", text);
      break;
    case "!react":
      react(message, text);      
      break;
    case "!voteyacrs":
      reacttomessage(message, ["🇦","🇧","🇨","🇩","🇪"]);      
      break;
    case "!voteall":
      message.delete();
      sendall(text, true);   
      break;
    case "!vote":
      reacttomessage(message, ["✅","❎"]);
      break;
    case "!bigtext":
      bigtext(message, text);
      break;
    case "!suggest":
      message.delete();
      mymaster.send(text + " ||| " + message.author.username);
      break;
    case "!announce":
      message.delete();
      sendall(text, false);
      break;
  }
}

function about(message) {
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
}

function generatequote(message) {
  message.delete();
  fs.readFile('./quotes.txt', 'utf8', function (err, contents) {
    contents = contents.split("\n");
    message.reply('`' + contents[Math.floor(Math.random() * contents.length)] + '`');
  });
}

function playmusic(message, song) {
  message.delete();
  if (message.member.voiceChannel) {
    message.member.voiceChannel.join().then(connection => {
      const dispatcher = connection.playStream(fs.createReadStream('./songs/' + song + '.mp3'));
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
}

function chooserandom(message, text) {
  text = text.substring(text.indexOf("<@&")+3, text.indexOf(">"));
  people = Array.from(message.guild.roles.get(text).members);
  result = people[Math.floor(Math.random() * people.length)][1];
  message.channel.send("<@!" + result.id + ">");
}

function runprogr(message, program, params) {
  params.splice(0,1);
  var pyProg = spawn('python', ["./scripts/" + program + ".py", params.join(" ")]);
  pyProg.stdout.on('data', function (data) {
    data = data.toString('utf8');
    message.channel.send("```css\n" + data + "\n```");
  });
}

// send emoji letter text
function bigtext(message, text) {
  text.splice(0,1);
  message.delete();
  text = text.join(" ").toUpperCase();
  newmessage = "";
  for (i = 0; i < text.length; i++) {
    char = emojis[text.charAt(i)];
    if (char) {
      newmessage += char + "\u200B";
    } else {
      newmessage += text.charAt(i);
    }
  }
  message.reply(newmessage);
}

function react(message, text) {
  message.delete();
  text.splice(0,1);
  //text = text.join(" ").toUpperCase().trim();
  message.channel.fetchMessages({
    limit: 1,
    before: message.id
  }).then(function (messages) {
    message = Array.from(messages)[0][1];
    var reactstring = []
    for (index = 0; index < text.length; ++index) {
      i = text[index];
      i = i.toUpperCase();
      if (i.startsWith("<")) {
        i = i.substring(i.indexOf(":", 3)+1, i.indexOf(">"));
        reactstring.push(message.guild.emojis.get(i));
      } else {
        for (var j = 0; j < i.length; j++) {
          reactstring.push(emojis[i.charAt(j)]);
        }        
      }
    }
    reacttomessage(message, reactstring)
  });
}


function sendall(text, vote) {
  text.splice(0,1);
 infochat.send("@everyone " + text.join(" ")).then(function (message) {
    if (vote) {
      reacttomessage(message, ["✅","❎"]);
    }
  });
}

// react to with emoji
function reacttomessage(message, reaction) {
  if (reaction.length > 0) {
    message.react(reaction[0]).then(function () {
      reaction.splice(0, 1);
      reacttomessage(message, reaction);
    })
  }
}



client.login(require("./secret"));