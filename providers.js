import fs from "fs";
import csv from "csv-parser";
import { format } from "@fast-csv/format";

const readStream = fs.createReadStream("valid_emails.csv");
const writeStream = fs.createWriteStream("providers.csv");

const providerCounts = new Map();

const csvStream = format({ headers: ["provider", "count"] });
csvStream.pipe(writeStream);

readStream
  .pipe(csv())
  .on("data", (row) => {
    const email = row.email || Object.values(row)[0];
    if (!email) return;

    const provider = email.split("@")[1];
    if (provider) {
      providerCounts.set(provider, (providerCounts.get(provider) || 0) + 1);
    }
  })
  .on("end", () => {
    const sortedProviders = [...providerCounts.entries()].sort(
      (a, b) => b[1] - a[1]
    );

    for (const [provider, count] of sortedProviders) {
      csvStream.write({ provider, count });
    }

    csvStream.end();
    console.log("Provider analysis complete");
  });
