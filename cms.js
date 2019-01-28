#!/usr/bin/env node
const request = require('request');
const diff = require('deep-diff').diff;
const { RichEmbed } = require('discord.js');
var old = undefined;
        
function test(channel) {
    request('https://cms.johncat.co.uk/rankings/scores', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        if (old == undefined) {
            old = body;
            return;
        }

        var difference = diff(old, body);
        if (difference == undefined) {
            old = body;
            return;
        }
        var tosend = false;
        const embed = new RichEmbed()
            .setTitle("New Score in CMS!")
            .setColor(0x000000)
            .setFooter("Join the competition at https://cms.johncat.co.uk");//, me.avatarURL);
        difference.forEach(element => {
            if (element.kind == "E") {
                if (element.path == undefined) {

                } else if (element.path.length == 2) {
                    //checged existing score
                    tosend = true;
                    embed.addField(element.path[0], "Has improved their '" + element.path[1] + "' score from " + lhs + " to " + rhs, false)
                }
            } else if (element.kind == "N") {
                if (element.path.length == 2) {
                    //added new task
                    tosend = true;
                    embed.addField(element.path[0], "Has achieved '" + element.path[1] + "' score of " + rhs, false)
                } else if (element.path.length == 1) {
                    //added new user
                    for (var task in element.rhs) {
                        tosend = true;
                        embed.addField(element.path[0], "Has achieved '" + task + "' score of " + element.rhs[task], false)
                    }
                }
            }
        });
        if (tosend) {            
            channel.send(embed);
        }
        old = body;
    });
}
module.exports = test;