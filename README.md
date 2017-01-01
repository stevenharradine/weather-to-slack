# weather-to-slack
Grabs weather and dumps it into a slack channel(s)

## usage
### install npm dependancies
```
npm install
```

### look up your data file on the Environment Canada website
 1. go to https://weather.gc.ca/business/index_e.html
 2. in the `HTML Code Creator` select your `Province/Territory` and `Locations`
 3. press the button `display code`
 4. go to the iframe page in the code generated
 5. view source (control + u)
 6. find the js data file (should look something like this `//weather.gc.ca/wxlink/site_js/s0000458_e.js`)
 7. `s0000458_e.js` is your `weather_code` for use later

### run command
```
node weather {{ slack_token }} {{ weather_code }} {{ slack_channel }}
```
where
 * `slack_token` - token from slack T########/B########/########################
 * `weather_code` - js file from Environment Canada (instructions above)
 * `slack_channel` - the channel or user to post too (optional, if not provided the slack tokens default channel will be used)
