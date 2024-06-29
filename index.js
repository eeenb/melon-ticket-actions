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
      throw new Error("请设置所有必需的输入参数");
    }

    const res = await axios({
      method: "POST",
      url: "https://tkglobal.melon.com/tktapi/product/seatStateInfo.json",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
        "Referer": "https://tkglobal.melon.com",
        "Origin": "https://tkglobal.melon.com",
        "Cookie": "PCID=17186454890329128725696; PC_PCID=17186454890329128725696; _fwb=33iD22f1DoQYGFABHQjuL6.1718645491020; POC=WP10; _T_ANO=L7+dqUd2KBcwgKL+dgV1Jrbl0OEAn2+ocXKe2WNz9ebYXRQJKUGJJyMU6mIiR4Gx+t8uXkb3ihJonRdEYup3YD7FP0io14gmLv9mNgtW8Sz8e2kCi0qI1tB9PctqIXcJJvAO6Xa0K1DvU//zRvNB6Sf1ZHY5gXLfIpAswCIJsP5kMho5jawAiWXGF4S9ExtMBj2E9JVxLPk2GzqBCeqKyUuieQ1EDAdnbUjMllaaF4ip3CCR2/k0u5i3y5BsA02iW3rIyQOxAkpNxDimo5FUW9aVxWfUmt/r4Kk7SDBOE7QWKgS/7A1Pq1ppyYFTIH87GIHzIESxFpk9ih2EzG9rnQ==; NA_SAC=dT1odHRwcyUzQSUyRiUyRnRrZ2xvYmFsLm1lbG9uLmNvbSUyRnJlc2VydmF0aW9uJTJGcG9wdXAlMkZzdGVwRmluaXNoLmh0bSUzRnJzcnZTZXElM0QyMDI0MDYyNjA3NDE4MTcyfHI9aHR0cHMlM0ElMkYlMkZ0a2dsb2JhbC5tZWxvbi5jb20lMkZyZXNlcnZhdGlvbiUyRmFqYXglMkZwYXlJbml0Rm9ybS5odG0lM0Zwcm9jTW9kZSUzRFMlMjZqdHlwZSUzREklMjZldHlwZSUzRCUyNnBheU5vJTNEMjAyNDA2MjYxMDMzNTc1MiUyNnJzcnZTZXElM0QyMDI0MDYyNjA3NDE4MTcyJTI2cGF5TWV0aG9kQ29kZSUzREFQMDAwMSUyNmV4dEJwTm8lM0QwJTI2ZmxwbGFuVHlwZUNvZGUlM0REUjAwMDIlMjZjaGtBZ3JlZUNoYW5uZWwlM0QlMjZzdGF0dXMlM0QwJTI2c2VydmljZV9vcmRlcl9pZCUzRDgwMjAwMDAzNDUyOTIzMzklMjZka3BnX3BheW1lbnRfaWQlM0Q4MDIwMDAwMzQ1MjkyMzM5JTI2cmVxX3BheV9tZXRob2QlM0RjYXJkX2ZvcmVpZ24lMjZvcmRlcl9zdGF0dXMlM0Qx; TKT_POC_ID=WP19; i18next=EN; MAC_T=\"0ALghgN7G/6eQT/BL8mMUAAzYc6SyGoWpuMNxnjRIw/tmtOFtqvH9CdXE3NBxW+UNk3n3RY6Jwp0g0n045Mkkw==\"; keyCookie_T=1000668715; JSESSIONID=A5D34A1C11366F99B08FBAB99B6E7DA6; NetFunnel_ID=WP15; wcs_bt=s_322bdbd6fd48:1719622146"
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
      const link = `https://tkglobal.melon.com/performance/index.htm?${qs.stringify({
        prodId: productId,
      })}`;
      console.log(`${message} ${link}`);
    } else {
      console.log("没有可用的座位或 chkResult 为 false");
    }
  } catch (e) {
    console.error("发生错误:", e.message);
    if (e.response) {
      console.error("响应数据:", e.response.data);
      console.error("响应状态:", e.response.status);
      console.error("响应头:", e.response.headers);
    }
    console.error("堆栈跟踪:", e.stack);
    process.exit(1);
  }
})();
