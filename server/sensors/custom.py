from time import strftime as gtime

class weatherLib:
    def __init__(self, userLocation):
        self.userLocation = userLocation;

    def getMetricData():
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

    def getMetricData():
        apiAuthorizationHeaders = {'Authorization' : 'Bearer ' +  self.userAuthorizationToken.encode('ascii', 'ignore') }        
        userJawboneData = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = apiAuthorizationHeaders)
        userJawboneCurrentDay = json.loads(data.text)['data']['items'][0]
        userJawboneCurrentDaySteps = 0
        if (userJawboneDay['date'] == gtime("%Y%m%d")):
            userJawboneDay = userJawboneDay['details']['hourly_totals']
            for userJawboneHour in userJawboneDay.keys():
                userJawboneDaySteps += userJawboneCurrentDay[userJawboneHour]['steps'] 
        return userJawboneCurrentDaySteps