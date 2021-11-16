import { generateCsv } from "../src/generate-csv"

// Route for a vercel deployment
export default async function handler(req, res) {
  const html = (await generateCsv()).join('<br/>')
  res.send(html);
}