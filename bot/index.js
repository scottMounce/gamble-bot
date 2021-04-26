require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

bot.on('ready', () => {
  console.log(`Logged in aas ${bot.user.tag}!`);
})

let users = {};
let joinFlag = false;
let rollFlag = false;
let prefix = '-gamble'
let gold = 0;
let playerCount = 0;
let rollCount = 0;
let gambling = false;
let rounds = 0;

bot.on('message', (msg) => {  
  if(msg.content === '-cancel') {
    msg.channel.send('cancelled gambling')
    users = {};
    joinFlag = false;
    rollFlag = false;
    playerCount = 0;
    rollCount = 0;
    gambling = false;
  }

  if(msg.content === 'testgamble1234') {
    msg.channel.send(`connected`);
  }
  if(msg.content.startsWith(prefix) && gambling === false) {
    rounds++;
    console.log(rounds);
    gambling = true;   
    gold = msg.content.slice(prefix.length);
    console.log(gold); 
    joinFlag = true    
    msg.channel.send(`Let's Gamble! This is a ${gold}g roll!!! Type 1 to enter. Type -1 to remove yourself. Type -cancel to cancel.`)           
    setTimeout(() => {
      if (playerCount > 1 && gambling === true) {
        msg.channel.send('Roll Now! Just type roll or Roll or ROLL or -roll or -Roll or -ROLL you fuckin fucks.')
        joinFlag = false
        rollFlag = true;
      } else {
        msg.channel.send('Add more players then try again!')
        joinFlag = false;
        gambling = false;
      }
    }, 30000)
  }
  //add players to round 
  if(msg.content === '1' && joinFlag === true && gambling === true) {  
    playerCount++;
    users[msg.author.username] = {
      rolled: false,
      num: -1
    }    
    console.log(users);
    if(msg.author.username === 'Herpulies') {
      msg.channel.send('Hmmmmm you sure you wanna do that Herp?');
    }
  }
  //remove players from round 
  if(msg.content === '-1' && joinFlag === true) {
    delete users[msg.author.username];
    console.log(users);
    playerCount--;
  }

  

  if(rollFlag === true && Object.keys(users).length > 0 && msg.content === 'roll' || msg.content === 'Roll' || msg.content === 'ROLL' || msg.content === '-roll' || msg.content === '-Roll' || msg.content === '-ROLL') {
    let rollNum = Math.floor((Math.random() * gold) + 1)
    if(!msg.author.username.rolled) {
      users[msg.author.username].num = rollNum;
      users[msg.author.username].rolled = true;
      rollCount++;
    }
    if(msg.author.username !== 'Herpulies') {
      msg.reply(`You rolled a ${users[msg.author.username].num}`);
    } else {
        msg.reply('You rolled a -56')
        setTimeOut(() => {
          msg.reply(`just kidding Herp, you rolled a ${users[msg.author.username].num}`)
        }, 10000)
    }    
    
    if(rollFlag === true && Object.keys(users).length > 0 && gambling === true) {    
      setTimeout(() => {
        for (let key in users) {
          if(users[key].rolled === false && gambling === true) {
            msg.channel.send(`${key} needs to roll`)
          } 
        }          
      }, 90000)
    }
    if(rollCount === playerCount) {
      let highest = 0;      
      let highestName;
      let lowest = gold;
      let lowestName;

      for (let key in users) {        
        if (users[key].num > highest) {
          highest = users[key].num
          highestName = key;
        }
        if (users[key].num < lowest) {
          lowest = users[key].num
          lowestName = key
        }
      }
      let difference = highest - lowest;      
      // let gString = diff.toString();
      // let splitDiff = gString.split('.');
      // let g = splitDiff[0] + 1;
      // let s = splitDiff[1];
      
      msg.channel.send(`${highestName} has defeated ${lowestName}! ${lowestName} owes ${highestName} ${difference} gold`)
      
      users = {};
      joinFlag = false;
      rollFlag = false;          
      playerCount = 0;
      rollCount = 0;
      gambling = false;
      

    }  
  }
  
  
})



