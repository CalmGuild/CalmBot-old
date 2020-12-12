import { Message } from "discord.js";
import Client from "../structures/Client";
module.exports = {
  name: "Help",
  description: "Shows this command",
  category: "Utility",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    let array = [];
    let categories = [];
    client.commands.forEach(command => {
      array.push({category: command.category, name: command.name, description: command.description})
      if(!categories.includes(command.category)){
        categories.push(command.category);
      }
    })
    
    console.log(categories);
    
    array.sort((a,b)=> a.category.localeCompare(b.category));
    categories.sort();
    
    let msg = `__**Avaliable Commands in ${message.guild.name}**__\n\nTo run a command do \`${client.prefix}command\`\n\n`;
    for(let i = 0; i < categories.length; i++){
      let first = true;
      for(let x = 0; x < array.length; x++){
        if(array[x].category === categories[i]){
          if(first){
            msg += `__**${categories[i]} Commands:**__\n`
            first = false;
          }
          msg += `**${array[x].name}:** ${array[x].description}\n`
        }
      }
      msg += "\n"
    }

    message.channel.send(msg)
    
  }
}