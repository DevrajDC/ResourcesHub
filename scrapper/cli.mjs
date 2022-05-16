import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import { existsSync } from 'fs';

import validator from 'validator';
import path from 'path';
import { oraPromise as ora } from 'ora';
import { fileURLToPath } from 'url';
import { filterEmpty, isEmpty } from './helpers.mjs';

/**
 *? This script is a ES Module so `__dirname` and `__filename` is not defined by default
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getCategories() {
  const target = path.join(__dirname, '../content');

  if (!existsSync(target)) {
    throw new Error('No content directory found');
  }

  const files = await fs.readdir(target);

  const categories = files.map((f) => f.replace('.json', ''));

  return categories;
}

async function getLinks(addMore = true, prevLinks = []) {
  if (!addMore) {
    return prevLinks.map((val) =>
      !val.startsWith('http') ? new URL(`https://${val}`).href : val
    );
  }

  const { link, next } = await inquirer.prompt([
    {
      name: 'link',
      type: 'input',
      message: 'Enter the link of the resource to scrap: ',
      validate: (value) => {
        if (validator.isURL(value)) {
          return true;
        } else {
          return 'Please enter a valid url: ';
        }
      },
    },
    {
      name: 'next',
      type: 'confirm',
      default: false,
      message: 'Would you like to add more links? : ',
    },
  ]);

  return getLinks(next, prevLinks.concat([link]));
}

async function getMetaData(links) {
  const browser = await ora(puppeteer.launch(), {
    text: 'Launching puppeteer',
  });

  const scrap = async (link) => {
    const page = await browser.newPage();

    await page.goto(link);

    const data = await page.evaluate(() => ({
      description: document.head
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content'),
      title: document.head
        .querySelector('meta[property="og:title"]')
        ?.getAttribute('content'),
      image: document.head
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content'),
      url:
        document.head
          .querySelector('meta[property="og:url"]')
          ?.getAttribute('content') || link,
    }));

    await page.close();

    return data;
  };

  const result = await Promise.all(
    links.map((l) =>
      ora(scrap(l), {
        text: `Scrapping: ${l.split('//')[1]}`,
        successText: (s) =>
          isEmpty(s)
            ? `No metadata found: ${l.split('//')[1]}`
            : `Scrapped: ${l.split('//')[1]}`,
        failText: `Failed to scrap: ${l.split('//')[1]}`,
      })
    )
  );

  await browser.close();

  return result;
}

export async function createCategory(name) {
  const target = path.join(__dirname, '../content', `${name}.json`);

  await fs.writeFile(
    target,
    JSON.stringify({
      name: name[0].toUpperCase() + name.slice(1),
      resources: [],
    })
  );

  return name;
}

async function writeToCategory(list, categoryName) {
  const target = path.join(__dirname, '../content', `${categoryName}.json`);

  if (!existsSync(target)) {
    await createCategory(categoryName);
  }

  const file_content = JSON.parse(
    await fs.readFile(target, { encoding: 'utf-8' })
  );

  file_content.resources.push(...list);

  console.log(list);

  return fs.writeFile(target, JSON.stringify(file_content));
}

async function main() {
  clear();

  console.log(
    chalk.yellow(figlet.textSync('RESOURCER', { horizontalLayout: 'full' }))
  );

  console.log(
    chalk.green(
      `Hit ${chalk.bold(chalk.red('ctrl/cmd + c'))} to quit the CLI\n`
    )
  );

  const categories = await getCategories();

  let { category } = await inquirer.prompt([
    {
      name: 'category',
      type: 'list',
      message: `Select a category: `,
      choices: categories.concat(['Add new']),
    },
  ]);

  if (category.toLowerCase() === 'add new') {
    const { category_name } = await inquirer.prompt({
      name: 'category_name',
      type: 'input',
      message: `Enter the category name: `,
      validate: (value) => {
        if (
          !existsSync(
            path.join(__dirname, '../content', `${value.toLowerCase()}.json`)
          )
        ) {
          return true;
        } else {
          return 'Category already exists';
        }
      },
    });

    category = await createCategory(category_name.toLowerCase());
  }

  const links = await getLinks();

  const data = await getMetaData(links);

  await writeToCategory(filterEmpty(data), category.toLowerCase());
}

main();
