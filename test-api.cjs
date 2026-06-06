const axios = require('axios');
async function run() {
  try {
    const res = await axios.get("https://draw.ar-lottery01.com/TrxWinGo/TrxWinGo_1M/GetHistoryIssuePage.json");
    console.log(JSON.stringify(res.data, null, 2).substring(0, 1000));
  } catch (err) {
    console.error(err);
  }
}
run();
