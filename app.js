import fs from "fs";
import csv from "csv-parser";
import { format } from "@fast-csv/format";
import validator from "email-validator";

const readStream = fs.createReadStream("newsletter_emails.csv");
const validWriteStream = fs.createWriteStream("valid_emails.csv");
const invalidWriteStream = fs.createWriteStream("invalid_emails.csv");

const validCsvStream = format({ headers: ["email"] });
const invalidCsvStream = format({ headers: ["email"] });

validCsvStream.pipe(validWriteStream);
invalidCsvStream.pipe(invalidWriteStream);

readStream
  .pipe(csv())
  .on("data", (row) => {
    let email = row.email || Object.values(row)[0];
    if (!email) return;

    email = email.toLowerCase().trim();

    if (validator.validate(email)) {
      validCsvStream.write({ email });
    } else {
      invalidCsvStream.write({ email });
    }
  })
  .on("end", () => {
    validCsvStream.end();
    invalidCsvStream.end();
    console.log("Processing complete");
  });
