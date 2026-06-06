const axios = require('axios');

async function test() {
  const modes = ['TrxWinGo_1M', 'TrxWinGo_3M', 'TrxWinGo_5M'];
  for (const m of modes) {
    try {
      const res = await axios.get(`https://draw.ar-lottery01.com/TrxWinGo/${m}/GetHistoryIssuePage.json`);
      console.log(m, res.data.data.list.length > 0 ? "SUCCESS" : "EMPTY");
    } catch (e) {
      console.log(m, "ERROR");
    }
  }
}
test();
