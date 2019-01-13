#!/usr/bin/env node
const {
    Client,
    RichEmbed
} = require('discord.js');
const client = new Client();
const emojis = require("./emoji").alphabet;




client.on('ready', () => {
    console.log(`Logged test in as ${client.user.tag}!`);
    var hackerman = client.guilds.get("492008433667801090");
    var me = hackerman.members.get(client.user.id);
    var roles = hackerman.roles;
    //var servantrole = roles.get("505041750218506258");
    //var botrole = roles.get("506422917689638913");
    //var hackminrole = roles.get("515144457113567243");
    //me.removeRole(botrole, "Testing bot timeout features");
    //hackminrole.setPermissions(1074922696, "Testing bot timeout features").catch((re) => {console.log(re)});
    //console.log(hackminrole);

    client.channels.get("492011587192881162").send("Welcome to Glasgow Uni CS Discord. Plaese select which year of study are you in.");
    //var hackerman = client.guilds.get("506186872184242196");
    //var roles = hackerman.roles;
    //var allrole = roles.get("506186872184242196");
    //var botrole = roles.get("506892548975886346");
    //allrole.setPermissions(8, "Testing bot timeout features").catch((re) => {console.log(re)});
    //console.log(botrole);
  });





client.login(require("./secret"));
//var ss = require("./algebra");
//console.log(ss("SELECT ASS, testcol, wow FROM TEST, lul WHERE ZZ=XX and thicc==yes"))