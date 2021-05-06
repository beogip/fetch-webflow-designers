import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "isomorphic-fetch";
import allowCors from "./helpers/allowCors";
import codes from "./helpers/regionsToCountry";
import { Parser } from "json2csv";
const API_URL = "https://webflow.com/api/designers/popular";
const MAX_PAGES = 30;

async function pullDesigners(offset: Number = 0, limit: Number = 20) {
  const data = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
  return data.json();
}

async function pullAllTopDesigners() {
  let offset = 0;
  const limit = 50;
  let designersToReturn: any[] = [];

  for (let i = 0; i < MAX_PAGES; i++) {
    console.log(`Pulling page ${i + 1}`);
    const designers = await pullDesigners(offset, limit);
    offset += limit;
    designersToReturn = [
      ...designersToReturn,
      ...designers.filter(
        (d) =>
          d.location &&
          d.location.geoIpCountry &&
          codes.European.includes(d.location.geoIpCountry)
      ),
    ];
  }
  const fields = [
    "firstName",
    "lastName",
    "location.country",
    "website",
    "title",
    "username",
  ];
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(designersToReturn);
    return csv;
  } catch (err) {
    console.error(err);
  }
}

async function exportCSV(
  req: VercelRequest,
  res: VercelResponse
): Promise<any> {
  const csv = await pullAllTopDesigners();
  res.setHeader("Content-Type", "text/csv");
  //   res.attachment("webflow-designers.csv");
  res.send(csv);
}

export default allowCors(exportCSV);
