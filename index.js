const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getDateWithOffset(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function makeBackdatedCommit(daysAgo = 1, commitsPerDay = 1) {
  const dataPath = path.join(__dirname, "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const dateStr = getDateWithOffset(daysAgo);

  for (let i = 0; i < commitsPerDay; i++) {
    data.commit += 1;
    data.date = dateStr;
    fs.writeFileSync(dataPath, JSON.stringify(data));

    execSync("git add data.json", { cwd: __dirname });
    execSync(`git commit -m "commit ${data.commit}"`, {
      cwd: __dirname,
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: dateStr,
        GIT_COMMITTER_DATE: dateStr,
      },
    });

    console.log(`✓ Committed (${i + 1}/${commitsPerDay}) for ${dateStr.slice(0, 10)}`);
  }
}

// Make 1 commit for yesterday
makeBackdatedCommit(1, 1);
