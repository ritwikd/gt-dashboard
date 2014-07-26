class weatherLib:
    def __init__(self, userLocation):
        self.userLocation = userLocation;

    def getWeatherData():
        requestData = requests.get("http://aviationweather.gov/adds/metars/?station_ids=" + self.userLocation + "&std_trans=standard&chk_metars=on&hoursStr=past+24+hours&submitmet=Submit");
        weatherData = nltk.clean_html(requestData.text)
        weatherData = weatherData.split(" ")
        temps = []
        for term in weatherData:
            if (len(term) == 5 and '/' in term):
                temps.append(term.split("/")[0])
        return temps;

class jawboneLib:
    def __init__(self, userAuthorizationToken):
        self.userAuthorizationToken = userAuthorizationToken;

    def getMotionData(date):
        auth = {'Authorization' : 'Bearer ' +  self.userAuthorizationToken.encode('ascii', 'ignore') }        
        data = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = auth)
        day = json.loads(data.text)['data']['items'][0]
        steps = 0
        if (day['date'] == date):
            day = day['details']['hourly_totals']
            for hour in day.keys():
                steps += day[hour]['steps'] 
        return steps