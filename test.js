const axios = require('axios');
async function test() {
  const response = await axios.post('https://api.bigwinqaz.com/api/webapi/GetTRXNoaverageEmerdList', {
      pageSize: 1,
      pageNo: 1,
      typeId: 13,
      language: 7,
      random: "b790dcc6376840d7a6ca2fbb71d7ae46",
      signature: "CA5A8A42691BC9D2141FBC36EE231885",
      timestamp: Math.floor(Date.now() / 1000)
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        'Ar-Origin': 'https://www.777bigwingame.org'
      }
    });
    console.log(response.data.data.data.gameslist[0].issueNumber);
}
test();
