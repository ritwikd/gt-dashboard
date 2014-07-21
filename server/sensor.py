from time import strftime as gtime
from datetime import timedelta
from random import randrange
from os import listdir
import threading
import requests
import json
import nltk

def writeData(username, date):
    if date == eval(gtime('%Y%m%d')):
        writeWeatherData(username, date)
        writeMotionData(username, date)
        writePhotoData(username, date)
        writeSleepData(username, date)
    print("Data written.")

def writeWeatherData(username, date):
    user = users.find_one({'name': username})
    if (user != None):
        airport = user['stats']['weather']
        requestData = requests.get("http://aviationweather.gov/adds/metars/?station_ids=" + airport + "&std_trans=standard&chk_metars=on&hoursStr=past+24+hours&submitmet=Submit");
        weatherData = nltk.clean_html(requestData.text)
        weatherData = weatherData.split(" ")
        temps = []
        for term in weatherData:
            if (len(term) == 5 and '/' in term):
                temps.append(term.split("/")[0])

        obj = {'metric' : 'weather', 'name' : username, 'date' : date}
        if (weather.find_one(obj) == None):
                obj['temps'] = temps
                weather.insert(obj)
                print("Weather inserted.")
        else:
            print(weather.find_one(obj))
            print("Weather already found.")

def writeMotionData(username, date):
    user = users.find_one({'name': username})
    if (user != None):
        obj = {'metric': 'motion', 'name' : username, 'date': date}
        if (motion.find_one(obj) == None):
            auth = {'Authorization' : 'Bearer ' +  user['auth'].encode('ascii', 'ignore') }        
            data = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = auth)
            day = json.loads(data.text)['data']['items'][0]
            if (day['date'] == date):
                day = day['details']['hourly_totals']
                steps = 0
                for hour in day.keys():
                    steps += day[hour]['steps'] 
                obj = {'metric': 'motion', 'name' : username, 'date': date, 'value' : steps}
                motion.insert(obj)
                print("Motion inserted.")
            else:
                print("Latest data not available.")
        else:
            print(motion.find_one(obj))
            print("Motion already found.")

def writePhotoData(username, date):
    user = users.find_one({'name' : username})
    if (user != None):
        obj = {'metric' : 'photos', 'name' : username, 'date' : date}
        if (photos.find_one(obj) == None):
            pics = listdir('pics')
            picarr = []
            usedpics = []
            for i in range(3):
                picn = randrange(len(pics))
                while(picn in usedpics):
                    picn = randrange(len(pics))
                usedpics.insert(0, picn)
                picarr.append(open('pics/' + pics[picn], "r").read().encode("base64"))
            obj['value'] = picarr
            photos.insert(obj)
            print("Photos inserted.")
        else:
            print("Photos already found.")
        
        
def writeSleepData(username, date):
    user = users.find_one({'name' : username})
    if (user != None):
        obj = {'metric' : 'sleep', 'name' : username, 'date':  date}
        if (sleep.find_one(obj)) == None:
            obj['value'] = randrange(3) + 5
            sleep.insert(obj)       
            print("Sleep data inserted.")
        else:
            print("Sleep data already found.")

# def runAutoWrite():
#     threading.Timer(300, runAutoWrite).start()
#     writeData()

# runAutoWrite()