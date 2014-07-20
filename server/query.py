from pymongo import MongoClient
from datetime import timedelta
from flask import Flask, make_response, request, current_app
from functools import update_wrapper
import requests
import json
import nltk
from random import randrange
from time import strftime as gtime
from os import listdir

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods
        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator
app = Flask(__name__)

db = MongoClient('localhost', 27017).data
users = db.users
motion = db.motion
sleep = db.sleep
photos = db.photos
weather = db.weather

@app.errorhandler(404)
@app.route('/<username>')
@crossdomain(origin='*')
def getDate(username):
    if request.args.get('type') == 'user':
        for user in users.find():
            if user['name'] == username:
                del(user['_id'])
                return json.dumps(user)
        return json.dumps({'name' : 'null' }), 404
    elif request.args.get('type') == 'data':
        metric = request.args.get('metric')
        date = request.args.get('date')
        data = db[metric].find_one({'metric' : metric, 'name' : username, 'date': eval(date)})
        if (data == None):
            return json.dumps({'metric' : metric, 'name' : username, 'date' : eval(date), 'value' : 'null'})
        del(data['_id'])
        return json.dumps(data)
    elif request.args.get('type') == 'write':
        writeData(username, eval(request.args.get('date')))
        return 'Data written.'
    else:
        return 'Error.'

def writeData(username, date):
    if date == (eval(gtime('%Y%m%d')) - 1):
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
            print day
            day = day['details']['hourly_totals']
            steps = 0
            for hour in day.keys():
                steps += day[hour]['steps'] 
            obj = {'metric': 'motion', 'name' : username, 'date': date, 'value' : steps}
            motion.insert(obj)
            print("Motion inserted.")
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
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)