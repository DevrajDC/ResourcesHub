import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import puppeteer from 'puppeteer';
import fs from 'fs';


let category;
let x = true;
let resources = [];
let resourcesData = [];
let count=0;

//to clear the terminal
clear();

//For the initial text
console.log(
  chalk.yellow(
    figlet.textSync('RESOURCER', { horizontalLayout: 'full' })
  )
);

//Inquiry to get the category, this after getting the category, starts the startInquiry function
inquirer
  .prompt([
    {
      name: 'Category',
      type: 'input',
      message: 'Enter the category [A/B/C/D] (or type exit):',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter atleast one link (or type exit).';
        }
      }
    },
  ])
  .then((answers) => {
    category = answers.Category;
    startInquiry();
  })

  //this function keeps getting links until the user types exit, and later calls the scrapeData function
  function startInquiry(){
    if (x === true){
      askLinks()
      .then(answers => {
        if(answers.Links === 'exit'){
          x=false;
          resources.forEach(async(element,i,arr) => {
            await scrapeData(element);
            count++;
            if(count === arr.length){
              console.log("Done Scraping")
              fs.writeFileSync(`../content/resources/${category}.json`,JSON.stringify(resourcesData));
            }
          })
        }
        else{
          resources.push(answers.Links);
          startInquiry();
        }
      });
    }
}
  
//this function prompts user to type in the links
async function askLinks(){
  const questions = [
    {
      name: 'Links',
      type: 'input',
      message: 'Enter the link of the resources to fetch data (or type exit):',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter atleast one link (or type exit).';
        }
      }
    },
    
  ];
  return inquirer.prompt(questions);
}


//this function scrapes the data from the links
async function scrapeData(link){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  let data = await page.evaluate(() => {
    return {
      description:document.head.querySelector('meta[property="og:description"]')?.getAttribute("content"),
      title:document.head.querySelector('meta[property="og:title"]')?.getAttribute("content"),
      image:document.head.querySelector('meta[property="og:image"]')?.getAttribute("content"),
      url:document.head.querySelector('meta[property="og:url"]')?.getAttribute("content"),
    }

  });
  
  resourcesData.push(data);

  await browser.close();
}

