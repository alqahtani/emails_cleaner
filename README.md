# Email Cleaner

you can extract your list of emails in a `newsletter_emails.csv` file and run the code:

`node app.js`

the output will be two files: `valid_emails.csv` and `invalid_emails.csv`

you can make round two of the list in `invalid_emails.csv` by running `cleaner.js` code

`node cleaner.js`

the output will be: `cleaned_emails.js` and `still_invalid_emails.js`

Thers is also a script `providers.js` which will output a CSV file with the providers and count of their usage. This will help you catch common mistakes like `@gamil` instead of `gmail.com`

---

## Credit: [Claude.ai](https://claude.ai/)

👋 have a nice day
