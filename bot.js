#!/usr/bin/env node
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

  var http = require('http');
  http.createServer(function (req, res) {
    var teststring = "" + req.url.substring(2);
    if (teststring.indexOf("johncat.co.uk") != -1) {
      sendall([null, teststring + "?utm_source=AlexBot"], false, true);
    }
    res.end("done");
  }).listen(8056);
});

client.on('error', () => {
  console.log("RESTARTING");
  client.login(require("./secret"));
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
  switch (text[0]) {
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
    case "!react":
      react(message, text);
      break;
    case "!voteyacrs":
      reacttomessage(message, ["🇦", "🇧", "🇨", "🇩", "🇪"]);
      break;
    case "!voteall":
      message.delete();
      sendall(text, true, true);
      break;
    case "!vote":
      reacttomessage(message, ["✅", "❎"]);
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
      sendall(text, true, false);
      break;
    case "!edit":
      message.delete();
      edit(text);
      break;
    case "!GDPR":
      message.reply("We have updated our privacy policy. Please acknowledge new terms here: https://johncat.co.uk");
      break;
    case "!delete":
      message.delete().catch(errorlog);
      deletemessage(text);
      break;
    case "!timeout":
      reacttomessage(message, ["✅", "❎"]);
      timeout(message, text);
      break;
  }
}

function errorlog(er) {
  console.log(er);
}

function about(message) {
  message.delete();
  const embed = new RichEmbed()
    .setTitle("i'm bot made by Alex!")
    .setColor(0x00FF00)
    .setDescription("Here is what i can do:")
    .addField("Votes", '\
    **!vote** -> General YES/NO vote \n\
    **!voteyacrs** -> Geberal ABCDE vote \n\
    **!voteall** -> General YES/NO votee in announcments channel (Admin only) \
    ', true)
    .addField("Utilities", '\
    **!algebra** -> Converts your SQL query into relational algebra (Beta) \n\
    **!random** -> Choose random person from @Role on server (Admin only) \n\
    **!announce** -> Send a messege with @everybody tag and your content to announcments chat (Admin only) \n\
    **!editannounce** -> Edit last announcment (Admin only) \
    ', true)
    .addField("Fun chat stuff", '\
    **!quote** -> Send a random quote from a movie \n\
    **!react** -> Convert your text or emoji into reaction for a previous message in channel \n\
    **!bigtext** -> Convert the text you are sending into emoji letters \n\
    **!GDPR** -> Print privacy notice (duh) \
    ', true)
    .addField("Music", '\
    **!:ab:ortnite** -> You need to be in voice chat for it to work \n\
    **!despacito** -> You need to be in voice chat for it to work (Beta) \
    ', true)
    .addField("Help", '\
    **!help** -> Prints this message and causes other bots to freak out \n\
    **!about** -> Prints this message \n\
    **!suggest** -> Send suggestion to my creator \
    ', true)
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

function deletemessage(text) {
  var chat = client.channels.get(text[1]);
  chat.fetchMessage(text[2]).then(function (message) {
     message.delete();
  });
}

//cleanup
function chooserandom(message, text) {
  text = text.substring(text.indexOf("<@&") + 3, text.indexOf(">"));
  people = Array.from(message.guild.roles.get(text).members);
  result = people[Math.floor(Math.random() * people.length)][1];
  message.channel.send("<@!" + result.id + ">");
}

function runprogr(message, program, params) {
  params.splice(0, 1);
  var pyProg = spawn('python', ["./scripts/" + program + ".py", params.join(" ")]);
  pyProg.stdout.on('data', function (data) {
    data = data.toString('utf8');
    message.channel.send("```css\n" + data + "\n```");
  });
}

// send emoji letter text
function bigtext(message, text) {
  text.splice(0, 1);
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
  text.splice(0, 1);
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
        i = i.substring(i.indexOf(":", 3) + 1, i.indexOf(">"));
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


function sendall(text, everyone, vote) {
  text.splice(0, 1);
  var mixin = "";
  if (everyone) {
    mixin = "@everyone \n";
  }
  //this needs to be a setting
  client.channels.get("505347340014714880").send(mixin + text.join(" ")).then(function (message) {
    if (vote) {
      reacttomessage(message, ["✅", "❎"]);
    }
  });
}

function edit(text) {
  var chat = client.channels.get(text[1]);
  chat.fetchMessage(text[2]).then(function (message) {
    text.splice(0, 3);
    message.edit(text.join(" "));
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

function timeout(message, text) {
  var questionuser = message.mentions.users.first();
  setTimeout(() => {
    var votesfor = 0;
    var collisions = 0;
    var votesagainst = message.reactions.get("❎").users;
    message.reactions.get("✅").users.forEach(user => {
      if (!votesagainst.get(user.id)) {
        votesfor+=1;
      } else {
        collisions+=1;
      }
    });
    votesagainst = votesagainst.size - collisions;
    var totalvotes = votesfor+votesagainst+collisions;
    if (totalvotes<5) {
      message.channel.send("Vote unsuccessful: less than 5 people voted!");
    } else if ((votesfor/votesagainst)<2) {
      message.channel.send("Vote unsuccessful: less than 66% of people agreed!");
    } else {
      message.channel.send("Vote successful: user <@!" + questionuser.id + "> has been timed out for 2 hours!");
      message.guild.fetchMember(questionuser).then(questionuser => {
        //this needs to be a setting
        questionuser.addRole("492008978583257088", "voted timeout");
        setTimeout(() => {
          questionuser.removeRole("492008978583257088", "timeout ended");
        }, 1000*60*60*2);
      });
    }
  }, 10000);
}

client.login(require("./secret"));