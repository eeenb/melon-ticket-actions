"use strict";
const core = require("@actions/core");
const axios = require("axios");
const qs = require("querystring");

(async () => {
  try {
    const productId = process.env.INPUT_PRODUCT_ID;
    const scheduleId = process.env.INPUT_SCHEDULE_ID;
    const seatId = process.env.INPUT_SEAT_ID;
    const webhookUrl = process.env.INPUT_SLACK_INCOMING_WEBHOOK_URL;
    const message = process.env.INPUT_MESSAGE || "티켓사세요";

    if (!productId || !scheduleId || !seatId || !webhookUrl) {
      throw new Error("Please set all required inputs");
    }


    const res = await axios({
      method: "POST",
      url: "https://tkglobal.melon.com/tktapi/product/seatStateInfo.json",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Referer": "https://tkglobal.melon.com",
        "Origin": "https://tkglobal.melon.com",
      },
      data: qs.stringify({
        prodId: productId,
        scheduleNo: scheduleId,
        seatId,
        volume: 1,
        selectedGradeVolume: 1,
      }),
    });

    console.log("Got response:", res.data);

    if (res.data && res.data.chkResult) {
      const link = `http://tkglobal.melon.com/performance/index.htm?${qs.stringify({
        prodId: productId,
      })}`;
      console.log(`${message} ${link}`);
    } else {
      console.log("No seats available or chkResult is false");
    }
  } catch (e) {
    console.error("Error occurred:", e.message);
    if (e.response) {
      console.error("Response data:", e.response.data);
      console.error("Response status:", e.response.status);
      console.error("Response headers:", e.response.headers);
    }
    console.error("Stack trace:", e.stack);
    process.exit(1);
  }
})();
