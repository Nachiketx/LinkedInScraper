const puppeteer = require('puppeteer');
const fs = require('fs/promises');

const run = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // paste url
  await page.goto('https://www.linkedin.com/in/gaurav-golecha-gg-346b5219a/');

  // wait for the page to load
  await page.waitForSelector('.pv-top-card--list', { visible: true });

  const [
    title,
    name,
    headline,
    location,
    industry,
    summary,
    experience_names,
    experience_company,
    experience_duration,
    education_names,
    education_institution,
    education_duration,
  ] = await page.evaluate(() => {
    const title = document.title;

    const name = document.querySelector('.pv-top-card--list .text-heading-xlarge').textContent;
    const headline = document.querySelector('.pv-top-card--list .pv-top-card--list__headline').textContent;
    const location = document.querySelector('.pv-top-card--list .pv-top-card--list__location').textContent;
    const industry = document.querySelector('.pv-top-card--list .pv-entity__secondary-title').textContent;
    const summary = document.querySelector('.pv-top-card--list .pv-top-card--list .pv-top-card--bio-description').textContent;

    const experience_names = Array.from(
      document.querySelectorAll('.pv-entity__summary-info h3')
    ).map((element) => element.textContent);

    const experience_company = Array.from(
      document.querySelectorAll('.pv-entity__summary-info .pv-entity__secondary-title')
    ).map((element) => element.textContent);

    const experience_duration = Array.from(
      document.querySelectorAll('.pv-entity__summary-info .pv-entity__summary-info--duration')
    ).map((element) => element.textContent);

    const education_names = Array.from(
      document.querySelectorAll('.pv-entity__organization-name')
    ).map((element) => element.textContent);

    const education_institution = Array.from(
      document.querySelectorAll('.pv-entity__school-name')
    ).map((element) => element.textContent);

    const education_duration = Array.from(
      document.querySelectorAll('.pv-entity__time-period')
    ).map((element) => element.textContent);

    return [title, name, headline, location, industry, summary, experience_names, experience_company, experience_duration, education_names, education_institution, education_duration];
  });

  await fs.writeFile('profiledata.json', JSON.stringify({ title, name, headline, location, industry, summary, experience_names, experience_company, experience_duration, education_names, education_institution, education_duration }, null, 2));

  console.log(title);
  console.log(name);
  console.log(headline);
  console.log(location);
  console.log(industry);
  console.log(summary);
  console.log(experience_names);
  console.log(experience_company);
  console.log(experience_duration);
  console.log(education_names);
  console.log(education_institution);
  console.log(education_duration);

  await browser.close();
};

run();