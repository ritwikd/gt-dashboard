from time import strftime as getFormattedTime
import requests
import json
import nltk

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
        return userWeatherTemperatures

class jawboneLib:
    def __init__(self, userAuthorizationToken):
        self.userAuthorizationToken = userAuthorizationToken

    def getMetricData(self):
	logFile = open('jaw.log', 'a')
	print(getFormattedTime("%Y%m%d") + "\n")
        apiAuthorizationHeaders = {'Authorization' : 'Bearer ' +  self.userAuthorizationToken.encode('ascii', 'ignore') }        
        userJawboneData = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = apiAuthorizationHeaders)
        userJawboneDay = json.loads(userJawboneData.text)['data']['items'][0]
        userJawboneDaySteps = 0
	currentDate = getFormattedTime("%Y%m%d")
	print currentDate + ", " + str(userJawboneDay['date'])

        if (str(userJawboneDay['date']) == currentDate):
	    print("Successful!\n")
            userJawboneDay = userJawboneDay['details']['hourly_totals']
	    print(json.dumps(userJawboneDay))
            for userJawboneHour in userJawboneDay.keys():
                userJawboneDaySteps += userJawboneDay[userJawboneHour]['steps'] 

	print(str(userJawboneDaySteps) + "\n")
	logFile.close()
        return userJawboneDaySteps
