const express = require('express');
const axios = require('axios');
const { resolve } = require('path');
var cors = require('cors');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
  console.log('test-test');
  setInterval(async () => {
    await fetchDataUsingAxios(); // Use await here to handle the Promise properly
  }, 6000);
});

const fetchDataUsingAxios = async () => {
  const url = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY'; // Replace with the actual URL

  const config = {
    headers: {
      'accept-encoding': 'gzip',
      'content-type': 'application/json',
      referer: 'https://www.nseindia.com/option-chain',
      accept: '*/*',
      'user-agent': 'PostmanRuntime/7.32.3',
      cookie:
        'bm_sv=A265564DFA8706D2A6B12AE3D8F87854~YAAQXAHVFynW5YGNAQAAkffgxRZlPEO0eWGvmGdOv1v/bYN4Ia28G2KaFKEFt4YnGqAXagyddragOziPE6iA3m2L/DrtUigSELJQ38/xPXe5WFwdFv8Qf0i8yZ7HSUgfGZVZ2vIVjyKHHXG9TbdDbf7CnrQCZCR5Et3m42/TLRsYh90XeJbUg890XS4dLDdQYwoAosDkJyOxIw0kM56lEbfkv6XApY+DniUq2BlJX9YQa3oGFfVoeddAE0od0aOrNuE=~1; Path=/; Expires=Tue, 20 Feb 2024 11:37:05 GMT; Max-Age=7154;',
    },
  };

  try {
    const response = await axios.get(url, config);

    // Extracting the 'data' section from 'filtered'
    const filteredData = response.data.filtered.data;

    // Creating CSV content
    const csvContent = `updatedOn,strikePrice,expiryDate,CE_strikePrice,CE_expiryDate,CE_underlying,CE_identifier,CE_openInterest,CE_changeinOpenInterest,CE_pchangeinOpenInterest,CE_totalTradedVolume,CE_impliedVolatility,CE_lastPrice,CE_change,CE_pChange,CE_totalBuyQuantity,CE_totalSellQuantity,CE_bidQty,CE_bidprice,CE_askQty,CE_askPrice,CE_underlyingValue,PE_strikePrice,PE_expiryDate,PE_underlying,PE_identifier,PE_openInterest,PE_changeinOpenInterest,PE_pchangeinOpenInterest,PE_totalTradedVolume,PE_impliedVolatility,PE_lastPrice,PE_change,PE_pChange,PE_totalBuyQuantity,PE_totalSellQuantity,PE_bidQty,PE_bidprice,PE_askQty,PE_askPrice,PE_underlyingValue\n`;

    const currentDate = new Date();
    const formattedDate = currentDate.toString();

    // Adding data rows to CSV content
    const csvRows = filteredData.map((item) => {
      return `${formattedDate},${item.strikePrice},${item.expiryDate},${item.CE.strikePrice},${item.CE.expiryDate},${item.CE.underlying},${item.CE.identifier},${item.CE.openInterest},${item.CE.changeinOpenInterest},${item.CE.pchangeinOpenInterest},${item.CE.totalTradedVolume},${item.CE.impliedVolatility},${item.CE.lastPrice},${item.CE.change},${item.CE.pChange},${item.CE.totalBuyQuantity},${item.CE.totalSellQuantity},${item.CE.bidQty},${item.CE.bidprice},${item.CE.askQty},${item.CE.askPrice},${item.CE.underlyingValue},${item.PE.strikePrice},${item.PE.expiryDate},${item.PE.underlying},${item.PE.identifier},${item.PE.openInterest},${item.PE.changeinOpenInterest},${item.PE.pchangeinOpenInterest},${item.PE.totalTradedVolume},${item.PE.impliedVolatility},${item.PE.lastPrice},${item.PE.change},${item.PE.pChange},${item.PE.totalBuyQuantity},${item.PE.totalSellQuantity},${item.PE.bidQty},${item.PE.bidprice},${item.PE.askQty},${item.PE.askPrice},${item.PE.underlyingValue}\n`;
    });

    // Writing CSV content to a file
    console.log('Updating on :', formattedDate);
    // console.log(csvContent + csvRows.join(''));
    // fs.writeFileSync('option_chain_data.csv', csvContent + csvRows.join(''));
  } catch (error) {
    console.error('Error fetching data using axios:', error);
  }
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
