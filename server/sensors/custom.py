from time import strftime as getFormattedTime
import requests
import json

class weatherLib:
    def __init__(self, userLocation):
        self.userLocation = userLocation;

    def getMetricData(self):
        userWeatherRequestData = requests.get("http://aviationweather.gov/adds/metars/?station_ids=" + self.userLocation + "&std_trans=standard&chk_metars=on&hoursStr=past+24+hours&submitmet=Submit");
        userWeatherData = nltk.clean_html(userWeatherRequestData.text)
        userWeatherData = userWeatherData.split(" ")
        userWeatherTemperatures = []
        for userWeatherItem in userWeatherData:
            if (len(userWeatherItem) == 5 and '/' in userWeatherItem):
                userWeatherTemperatures.append(userWeatherItem.split("/")[0])
        return userWeatherTemperatures;

class jawboneLib:
    def __init__(self, userAuthorizationToken):
        self.userAuthorizationToken = userAuthorizationToken

    def getMetricData(self):
        apiAuthorizationHeaders = {'Authorization' : 'Bearer ' +  self.userAuthorizationToken.encode('ascii', 'ignore') }        
        userJawboneData = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = apiAuthorizationHeaders)
        userJawboneDay = json.loads(userJawboneData.text)['data']['items'][0]
        userJawboneDaySteps = 0
        if (userJawboneDay['date'] == getFormattedTime("%Y%m%d")):
            userJawboneDay = userJawboneDay['details']['hourly_totals']
            for userJawboneHour in userJawboneDay.keys():
                userJawboneDaySteps += userJawboneDay[userJawboneHour]['steps'] 
        return userJawboneDaySteps
