const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
  let week_totals = Array(17).fill(0);
  for (let year = 1990; year < 2002; year++) {
    if (year == 1982 || year == 1987 || year == 1993) {
      // Strike shortened seasons, skip
      continue;
    }
    for (let week = 1; week <= 17; week++) {
      await page.goto(
        `https://www.pro-football-reference.com/years/${year}/week_${week}.htm`
      );
      const totals = await page.$$eval("table.teams td:nth-child(2)", (tds) =>
        // The `slice` is a giant hack, but works for now to ignore the live scores
        tds.slice(32).map((td) => parseInt(td.innerText))
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
