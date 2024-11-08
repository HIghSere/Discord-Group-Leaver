import axios from "axios";
import { prompt } from "./util/prompt.js";
import { Client } from "discord.js-selfbot-v13";
import { channel } from "diagnostics_channel";
const client = new Client({
    checkupdata: false
});

async function main() {
    const token = await prompt("token> ");
    if (!token || typeof token != "string") {
        throw new Error("Token is invalid.");
    } else {
        await client.login(token);
        const channels = client.channels.cache.filter(channel => channel.type === "GROUP_DM");
        for (const channel of channels.values()) {
            try {
                await leaveGroup(token, channel.id);
            } catch (e) {
                console.error("Error:", e);
            }
        }
    }
}
main();

async function leaveGroup(token, channel_id) {
    if (isNaN(channel_id)) {
        throw new Error("Channel ID is invalid.");
    } else {
        try {
            const response = await axios.delete(`https://discord.com/api/v9/channels/${channel_id}?silent=false`, {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                    'Accept': '*/*',
                    "Accept-Encoding": `gzip, deflate, br, zstd`,
                    "Accept-Language": `ja;q=0.8`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                    "x-discord-locale": "en-US",
                    "x-discord-timezone": "Europe/Paris",
                    'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImphIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI1LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjI5NDUyMCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbCwiZGVzaWduX2lkIjowfQ=='
                }
            });
            if (response.status === 200) {
                console.log("✓ Leaved:", channel_id);
            } else {
                console.log("× Failed to leave:", channel_id)
            }
        } catch (e) {
            if (e.response.status === 429) {
                console.log("△ RateLimit:", channel_id);
            }
        }
    }
}