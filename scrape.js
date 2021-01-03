const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
  let week_totals = Array(17).fill(0);
  for (let year = 2002; year < 2010; year++) {
    for (let week = 1; week <= 17; week++) {
      await page.goto(
        `https://www.espn.com/nfl/scoreboard/_/year/${year}/seasontype/2/week/${week}`
      );
      const totals = await page.$$eval("td.total", (tds) =>
        tds.map((td) => parseInt(td.innerText))
      );
      const ppg = (totals.reduce((a, b) => a + b) / totals.length) * 2;
      week_totals[week - 1] += ppg;
      console.log(year, week, ppg);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  console.log(week_totals);

  await browser.close();
})();
