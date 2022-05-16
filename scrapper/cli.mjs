import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import { nanoid } from 'nanoid';
import ora from 'ora';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import validator from 'validator';

import {
  filterEmpty,
  hasSufficientMeta,
  isEmpty,
  sanitizeFilename,
  toAbsolutePath,
} from './helpers.mjs';

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
      !val.startsWith('http') ? new URL(`http://${val}`).href : val
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
      default: true,
      message: 'Would you like to add more links?: ',
    },
  ]);

  return getLinks(next, prevLinks.concat([link]));
}

async function getMetaData(links) {
  const spinner = ora({
    discardStdin: true,
    indent: 2,
  });

  spinner.start();

  spinner.info('Launching puppeteer');
  const browser = await puppeteer.launch().catch((err) => {
    spinner.fail('Failed to launch puppeteer');
    process.exit(1)
  });

  /** @param {import('ora').Ora} spinner */
  const scrap = async (link, spinner) => {
    const siteName = chalk.cyanBright(link.split('//')[1].replace('/', ''));

    try {
      const page = await browser.newPage();

      spinner.info(`Visiting: ${siteName}`);

      await page.goto(link);

      const data = await page.evaluate(() => ({
        description:
          document.head
            .querySelector('meta[property="og:description"]')
            ?.getAttribute('content') ||
          document.head
            .querySelector('meta[name="description"]')
            ?.getAttribute('content'),
        title:
          document.head
            .querySelector('meta[property="og:title"]')
            ?.getAttribute('content') ||
          document.head.querySelector('title').innerText,
        image: document.head
          .querySelector('meta[property="og:image"]')
          ?.getAttribute('content'),
        url:
          document.head
            .querySelector('meta[property="og:url"]')
            ?.getAttribute('content') || document.location.href,
      }));

      data._id = nanoid();

      // If no image is found, add a random placeholder
      if (!data.image) {
        data.image = `https://picsum.photos/seed/${data._id}/200/300`;
      }

      data.image = toAbsolutePath(data.image, link);

      await page.close();

      if (!hasSufficientMeta(data)) {
        spinner.color = 'red';
        spinner.fail(`Insufficient data: ${siteName}`);
        return {};
      }

      spinner.succeed(`Scrapped: ${siteName}`);

      return data;
    } catch (err) {
      spinner.color = 'red';
      spinner.fail(`Error scrapping: ${siteName}`);
      return {};
    }
  };

  spinner.info(`Started processing`);
  const result = await Promise.all(links.map((l) => scrap(l, spinner)));

  spinner.info('Closing puppeteer');

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
      choices: categories.concat(['Create new']),
    },
  ]);

  if (category.toLowerCase() === 'create new') {
    const { category_name } = await inquirer.prompt({
      name: 'category_name',
      type: 'input',
      message: `Enter the category name: `,
      validate: (value) => {
        if (
          !existsSync(
            path.join(
              __dirname,
              '../content',
              `${sanitizeFilename(value)}.json`
            )
          )
        ) {
          return true;
        } else {
          return 'Category already exists';
        }
      },
    });

    category = await createCategory(sanitizeFilename(category_name));
  }

  const links = await getLinks();

  const data = await getMetaData(links);

  await writeToCategory(filterEmpty(data), sanitizeFilename(category));
}

main();
