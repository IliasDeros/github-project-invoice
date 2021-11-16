const fs = require('fs')
const { generateCsv } = require('./generate-csv')

const outputFilename = 'invoice_items.csv';

async function writeCsv() {
  const csv = await generateCsv()
  const formattedCsv = csv
    .map(row => row.join(','))
    .join('\n')
  fs.writeFileSync(outputFilename, formattedCsv, 'utf8')
  console.log(`Generated ${csv.length - 1} invoice items. See ${outputFilename}`)
}

(async () => {
  await writeCsv()
})()