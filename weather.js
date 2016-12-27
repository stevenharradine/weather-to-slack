var fs = require('fs');
var request = require('request');
var Slack = require('slack-node');

var slack_token = process.argv[2];
var weather_code = process.argv[3];
var slack_channel = process.argv[4];

console.log (slack_channel + "<<")

webhookUri = "https://hooks.slack.com/services/" + slack_token;
slack = new Slack();
slack.setWebhook(webhookUri);

var sleep = require('sleep');

var url = "http://weather.gc.ca/wxlink/site_js/" + weather_code + ".js"

var lock_execution = false; // lock for async slack calls to happen in order

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
        var icon = "";
        if (obCondition == "Cloudy") {
            icon = ":cloud:";
        }
        
        slack.webhook({
          channel: slack_channel,
          username: "WeatherBot: Currently",
          title: cityName + " " + obTemperature + "°C",
          title_link: cityURL,
          icon_emoji: icon,
          text: obTemperature + "°C " + obCondition + "(" + obWindSpeed + " km/h" + " " + obWindDir + ")"
        }, function(err, response) {
          console.log(response);
          display_future(html, i);
        });
    }
})

function display_future (html, i) {
    eval (html);
    var high = forecastHighs[i] != "" ? forecastHighs[i] + "°C" : "";
    var low = forecastLows[i] != "" ? forecastLows[i] + "°C" : "";

    icon = "";
    if (forecastIconCodes[i] == "Cloudy") {
        icon = ":cloud:";
    } else if (forecastIconCodes[i] == "02") {
        icon = ":sun_behind_cloud:";
    } else if (forecastIconCodes[i] == "03") {
        icon = ":sun_behind_cloud:";
    } else if (forecastIconCodes[i] == "16") {
        icon = ":snow_cloud:";
    } else if (forecastIconCodes[i] == "38") {
        icon = ":snow_cloud:";
    }

    slack.webhook({
      channel: slack_channel,
      username: forecastPeriods[i],
      icon_emoji: icon,
      text: " " + forecastConditions[i] + " " + high + "/" + low + "\n"
    }, function(err, response) {
      console.log(response);
      if (i < 2) {
        display_future(html, i + 1);
      }
    });
}
