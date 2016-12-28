var fs = require('fs');
var request = require('request');
var Slack = require('slack-node');

var slack_token = process.argv[2];
var weather_code = process.argv[3];
var slack_channel = process.argv[4];

var url = "http://weather.gc.ca/wxlink/site_js/" + weather_code + ".js"

webhookUri = "https://hooks.slack.com/services/" + slack_token;
slack = new Slack();
slack.setWebhook(webhookUri);

request(url, function(error, response, html){
    if(!error){
        eval (html);
        
        send_to_slack (
            "WeatherBot: Currently",
            obIconCode,
            obTemperature + "°C " + obCondition + "(" + obWindSpeed + " km/h " + obWindDir + ")",
            function (err, response) {
                display_forecast(html, 0);
            }
        );
    }
})

function display_forecast (html, i) {
    eval (html);
    var high = forecastHighs[i] != "" ? forecastHighs[i] + "°C" : "";
    var low = forecastLows[i] != "" ? forecastLows[i] + "°C" : "";

    send_to_slack (
        forecastPeriods[i],
        forecastIconCodes[i],
        " " + forecastConditions[i] + " " + high + "/" + low + "\n",
        function (err, response) {
            if (i < 2) {
                display_forecast (html, i + 1);
            }
        }
    );
}

function get_icon (icon_code) {
    return "http://weather.gc.ca/weathericons/small/" + icon_code +".png";
}

function send_to_slack (username, icon_code, text, call_back) {
    slack.webhook({
      channel: slack_channel,
      username: username,
      icon_emoji: get_icon (icon_code),
      text: text
    }, function(err, response) {
        if (err) {
            console.log (err);
        } else {
            console.log(response);
        }

        call_back(err, response);
    });
}
