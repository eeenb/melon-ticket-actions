"use strict";
const core = require("@actions/core");
const { IncomingWebhook } = require("@slack/webhook");
const axios = require("axios");
const qs = require("querystring");

(async () => {
    try {
        const productId = core.getInput('product-id');
        const scheduleId = core.getInput('schedule-id');
        const seatId = core.getInput('seat-id');
        const webhookUrl = core.getInput('slack-incoming-webhook-url');

        if (!productId || !scheduleId || !seatId || !webhookUrl) {
            throw new Error("Please set all required inputs");
        }

        const message = core.getInput("message") || "티켓사세요";
        const webhook = new IncomingWebhook(webhookUrl);

        const res = await axios({
            method: "POST",
            url: "https://tkglobal.melon.com/tktapi/product/seatStateInfo.json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                "Cookie": "_fwb=1466SLrmDtd8MJRxEDWnDKH.1719522226874; i18next=EN; JSESSIONID=9A94D015C1C8D677587A6C2157851FD4; keyCookie_T=1000668715; MAC_T=\"0ALghgN7G/6eQT/BL8mMULtqz+sgOksZwd44tuHUk9ethjBRkZPdMRLmjx4SraVseOONj3Bwbig3nsq/eq1AVA==\"; NetFunnel_ID=WP15; PC_PCID=17195219381610992302781; PCID=17195219381610992302781; TKT_POC_ID=TKT_POC_ID; wcs_bt=wcs_bt"
            },
            data: qs.stringify({
                prodId: productId,
                scheduleNo: scheduleId,
                seatId,
                volume: 1,
                selectedGradeVolume: 1
            })
        });

        console.log("Got response:", res.data);

        if (res.data && res.data.chkResult) {
            const link = `http://tkglobal.melon.com/performance/index.htm?${qs.stringify({ prodId: productId })}`;
            await webhook.send(`${message} ${link}`);
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
