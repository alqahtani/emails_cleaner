import fs from "fs";
import csv from "csv-parser";
import { format } from "@fast-csv/format";
import validator from "email-validator";

const readStream = fs.createReadStream("invalid_emails.csv");
const cleanedWriteStream = fs.createWriteStream("cleaned_emails.csv");
const stillInvalidWriteStream = fs.createWriteStream(
  "still_invalid_emails.csv"
);

const cleanedCsvStream = format({ headers: ["email"] });
const stillInvalidCsvStream = format({ headers: ["email"] });

cleanedCsvStream.pipe(cleanedWriteStream);
stillInvalidCsvStream.pipe(stillInvalidWriteStream);

const popularDomains = [
  "gmail",
  "hotmail",
  "icloud",
  "yahoo",
  "outlook",
  "protonmail",
];

function cleanEmail(email) {
  if (!email || typeof email !== "string") return "";

  email = email
    .toLowerCase()
    .trim()
    .replace(/[<>()]/g, "") // Remove <, >, (, )
    .replace(/\s+/g, "")
    .replace(/\.+/g, ".")
    .replace(/\.$/, "")
    .replace(/^\./, "");

  const [localPart, domain] = email.split("@");

  if (domain) {
    let cleanDomain = domain.replace(/_/g, ""); // Remove underscores from domain

    // Fix domains ending with popularDomains without .com
    for (const popDomain of popularDomains) {
      if (cleanDomain === popDomain) {
        cleanDomain += ".com";
        break;
      }
    }

    // Fix domains ending with popularDomainscom
    for (const popDomain of popularDomains) {
      if (cleanDomain.endsWith(`${popDomain}com`)) {
        cleanDomain = cleanDomain.replace(
          `${popDomain}com`,
          `${popDomain}.com`
        );
        break;
      }
    }

    email = `${localPart}@${cleanDomain}`;
  }

  return email.replace(/(.+)@(.+)/, (match, p1, p2) => {
    return `${p1.replace(/[^a-z0-9.]/g, "")}@${p2}`;
  });
}

readStream
  .pipe(csv())
  .on("data", (row) => {
    const originalEmail = row.email || Object.values(row)[0];
    if (!originalEmail) return;

    const cleanedEmail = cleanEmail(originalEmail);

    if (validator.validate(cleanedEmail)) {
      cleanedCsvStream.write({ email: cleanedEmail });
    } else {
      stillInvalidCsvStream.write({ email: originalEmail });
    }
  })
  .on("end", () => {
    cleanedCsvStream.end();
    stillInvalidCsvStream.end();
    console.log("Cleaning process complete");
  });
