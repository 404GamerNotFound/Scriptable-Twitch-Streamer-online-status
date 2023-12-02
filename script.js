const clientId = 'YOUR_TWITCH_CLIENT_ID'; // Replace with your Twitch Client ID
const clientSecret = 'YOUR_TWITCH_CLIENT_SECRET'; // Replace with your Twitch Client Secret
const streamerName = 'STREAMER_NAME'; // Replace with the name of the streamer you want to check

async function getAccessToken() {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
    const request = new Request(url);
    request.method = 'POST';
    const response = await request.loadJSON();
    return response.access_token;
}

async function isStreamerOnline(accessToken) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${streamerName}`;
    const request = new Request(url);
    request.headers = {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
    };
    const response = await request.loadJSON();
    return response.data && response.data.length > 0;
}

async function createWidget(isOnline) {
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#6441a5"); // Twitch color theme

    const title = widget.addText('Twitch Streamer Status');
    title.font = Font.boldSystemFont(18);
    title.textColor = Color.white();
    title.centerAlignText();

    widget.addSpacer(5);

    const statusText = isOnline ? `${streamerName} is currently streaming!` : `${streamerName} is offline.`;
    const status = widget.addText(statusText);
    status.font = Font.systemFont(15);
    status.textColor = Color.white();
    status.centerAlignText();

    if (isOnline) {
        widget.addSpacer(5);

        const liveIndicator = widget.addText('🔴 LIVE');
        liveIndicator.font = Font.boldSystemFont(13);
        liveIndicator.textColor = new Color("#e91916"); // Red color for live indicator
        liveIndicator.centerAlignText();
    }

    return widget;
}

async function run() {
    const accessToken = await getAccessToken();
    const onlineStatus = await isStreamerOnline(accessToken);
    const widget = await createWidget(onlineStatus);
    Script.setWidget(widget);
    Script.complete();
    widget.presentSmall();
}

run();
