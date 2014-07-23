from time import strftime as gtime
from random import randrange
from os import listdir
import threading
import requests
import json
import nltk

def writeData(user, date, db):
    if (user != None):
        if date == eval(gtime('%Y%m%d')):
            writeWeatherData(user['name'], date, user, db.weather)
            writeMotionData(user['name'], date, user, db.)
            writePhotoData(user['name'], date, user, db.)
            writeSleepData(user['name'], date, user, db.)

def writeWeatherData(date, user, weather):
    if (user != None):
        airport = user['stats']['weather']
        requestData = requests.get("http://aviationweather.gov/adds/metars/?station_ids=" + airport + "&std_trans=standard&chk_metars=on&hoursStr=past+24+hours&submitmet=Submit");
        weatherData = nltk.clean_html(requestData.text)
        weatherData = weatherData.split(" ")
        temps = []
        for term in weatherData:
            if (len(term) == 5 and '/' in term):
                temps.append(term.split("/")[0])

        obj = {'metric' : 'weather', 'name' : user['name'], 'date' : date}
        if (weather.find_one(obj) != None):
            weather.remove(obj)
        obj['temps'] = temps
        weather.insert(obj)

def writeMotionData(date, user, motion):
    obj = {'metric': 'motion', 'name' : user['name'], 'date': date}
    auth = {'Authorization' : 'Bearer ' +  user['auth'].encode('ascii', 'ignore') }        
    data = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = auth)
    day = json.loads(data.text)['data']['items'][0]
    if (day['date'] == date):
        if (motion.find_one(obj) != None):
            motion.remove(obj)
        day = day['details']['hourly_totals']
        steps = 0
        for hour in day.keys():
            steps += day[hour]['steps'] 
        obj = {'metric': 'motion', 'name' : user['name'], 'date': date, 'value' : steps}
        motion.insert(obj)
        

def writePhotoData(date, user, photos):
    if (user != None):
        obj = {'metric' : 'photos', 'name' : user['name'], 'date' : date}
        if (photos.find_one(obj) != None):
            photos.remove(obj)
        pics = listdir('pics')
        picarr = []
        usedpics = []
        for i in range(len(pics)):
            picarr.append(open('pics/' + pics[i], "r").read().encode("base64"))
        obj['value'] = picarr
        photos.insert(obj)
        


def writeSleepData(date, user, sleep):
    if (user != None):
        obj = {'metric' : 'sleep', 'name' : user['name'], 'date':  date}
        if (sleep.find_one(obj)) != None:
            sleep.remove(obj)
        obj['value'] = randrange(3) + 5
        sleep.insert(obj)

def autoWriteData(users, date, db):
    threading.Timer(1200, autoWriteData).start()
    logHandler = open("auto.log", "a")
    logHandler.write("Logged date on " + gtime("%Y%m%d") + " at " + gtime("%H%M%s") + ".\n")
    for user in users.find():
        writeData(user, date, db)
        logHandler.write("Wrote data for " + user['fullname'] + " under the username " + user['name'] + ".\n")
    logHandler.close()
