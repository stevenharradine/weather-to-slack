var fs = require('fs');
var request = require('request');
var Slack = require('slack-node');

var slack_token = process.argv[2];
var weather_code = process.argv[3];
var slack_channel = process.argv[4];

webhookUri = "https://hooks.slack.com/services/" + slack_token;
slack = new Slack();
slack.setWebhook(webhookUri);

var url = "http://weather.gc.ca/wxlink/site_js/" + weather_code + ".js"

request(url, function(error, response, html){
    if(!error){
/*
language = "e";
cityName = "Toronto";
provinceName = "ON";
cityURL = "http://weather.gc.ca/city/pages/on-143_metric_e.html";
isWarning = false;
isWatch = false;
isStatement = false;
obTemperature = "-1";
obIconCode = "10";
obCondition = "Cloudy"
obWindDir = "W";
obWindSpeed = "35";
obWindGust = "";
obWindChill = "-8";
obHumidex = "";
forecastPeriods = ["Today", "Tonight", "Wed"];
forecastIconCodes = ["03", "38", "02"];
forecastConditions = ["Mainly cloudy", "Chance of flurries", "A mix of sun and cloud"];
forecastHighs = ["0", "", "0"];
forecastLows = ["", "-5", ""];
*/
        eval (html);
        var i = 0;
        var icon = get_icon (obIconCode);
        
        send_to_slack (
            "WeatherBot: Currently",
            icon,
            obTemperature + "°C " + obCondition + "(" + obWindSpeed + " km/h" + " " + obWindDir + ")",
            function (err, response) {
                console.log(response);
                display_forecast(html, i);
            }
        );
    }
})

function display_forecast (html, i) {
    eval (html);
    var high = forecastHighs[i] != "" ? forecastHighs[i] + "°C" : "";
    var low = forecastLows[i] != "" ? forecastLows[i] + "°C" : "";

    icon = get_icon (forecastIconCodes[i]);

    send_to_slack (
        forecastPeriods[i],
        icon,
        " " + forecastConditions[i] + " " + high + "/" + low + "\n",
        function (err, response) {
            console.log(response);
            if (i < 2) {
                display_forecast (html, i + 1);
            }
        }
    );
}

function get_icon (icon_code) {
    var icon;

    if (icon_code == "02") {
        icon = ":sun_behind_cloud:";
    } else if (icon_code == "03") {
        icon = ":sun_behind_cloud:";
    } else if (icon_code == "08") {
        icon = ":snow_cloud:";
    } else if (icon_code == "10") {
        icon = ":cloud:";
    } else if (icon_code == "15") {
        icon = ":snow_cloud:";
    } else if (icon_code == "16") {
        icon = ":snow_cloud:";
    } else if (icon_code == "38") {
        icon = ":snow_cloud:";
    } else {
        icon = ":no_entry_sign:";
        console.log (icon_code);
    }

    return icon;
}

function send_to_slack (username, icon, text, call_back) {
    slack.webhook({
      channel: slack_channel,
      username: username,
      icon_emoji: icon,
      text: text
    }, function(err, response) {
        call_back(err, response);
    });
}
