require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const app = express();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const port = 3000;

const sendMessage = async () => {
  try {
    const accountData = await axios({
      method: "get",
      url: "https://api.youneedabudget.com/v1/budgets?include_accounts=true",
      headers: { Authorization: `Bearer ${process.env.YNAB_API_KEY}` },
    });

    const savingsBalance = accountData.data.data.budgets[0].accounts[0].balance;

    if (savingsBalance < parseInt(process.env.SAVINGS_ACCOUNT_LIMIT)) {
      try {
        await client.messages.create({
          body: "Your savings account is low!",
          from: process.env.TWILIO_PHONE_NUMBER,
          to: process.env.PHONE_NUMBER,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await client.messages.create({
          body: "Congrats! Your savings account is looking good!",
          from: process.env.TWILIO_PHONE_NUMBER,
          to: process.env.PHONE_NUMBER,
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

sendMessage();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
