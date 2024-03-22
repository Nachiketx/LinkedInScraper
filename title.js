const puppeteer = require('puppeteer');
const fs = require('fs/promises');

const run = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // paste url
  await page.goto('https://www.linkedin.com/in/gaurav-golecha-gg-346b5219a/');

  // wait for the page to load
  await page.waitForSelector('.experience-item__title', { visible: true });

  const [
    title,
    experience_names,
    experience_company,
    experience_duration,
        ] = await page.evaluate(() => {
    const title = document.title;

    const experience_names = Array.from(
      document.querySelectorAll('.experience-item__title')
    ).map((element) => element.textContent);

    const experience_company = Array.from(
      document.querySelectorAll('.experience-item__subtitle')
    ).map((element) => element.textContent);

    const experience_duration = Array.from(
      document.querySelectorAll('.date-range')
    ).map((element) => element.textContent);

    return [title, experience_names, experience_company, experience_duration];
  });

  await fs.writeFile('profiledata.txt', JSON.stringify({ title, experience_names, experience_company, experience_duration }, null, 2));

  console.log(title);
  console.log(experience_names);
  console.log(experience_company);
  console.log(experience_duration);

  await browser.close();
};

run();