from pymongo import MongoClient
from datetime import timedelta
from flask import Flask,make_response, request, current_app
from functools import update_wrapper
import requests
import json
import nltk
from time import strftime as gtime

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
        return json.dumps({ 'name' : 'null' }), 404
    elif request.args.get('type') == 'data':
        metric = request.args.get('metric')
        date = request.args.get('date')
        writeMotionData(username)
        writeWeatherData(username)
        data = db[metric].find_one({ 'metric' : metric, 'name' : username, 'date': eval(date)})
        if (data == None):
            return json.dumps({ 'metric' : metric, 'name' : username, 'date' : eval(date), 'value' : 'null'})
        del(data['_id'])
        return json.dumps(data)
    else:
	return "error"



def writeWeatherData(username):
    	for user in users.find():
        	if user['name'] == username:
            		airport = user['stats']['weather']
	requestData = requests.get("http://aviationweather.gov/adds/metars/?station_ids=" + airport + "&std_trans=standard&chk_metars=on&hoursStr=past+24+hours&submitmet=Submit");
	weatherData = nltk.clean_html(requestData.text)
    	weatherData = weatherData.split(" ")
	temps = []
	for term in weatherData:
        	if (len(term) == 5 and '/' in term):
			temps.append(term.split("/")[0])

	obj = { 'metric' : 'weather', 'name' : username, 'date' : gtime('%Y%m%d'), 'temps' : temps }
	if (weather.find_one(obj) == None):
		weather.insert(obj)


def writeMotionData(username):	
    for user in users.find():
	print user
        if user['name'] == username:
	    print user['name']
            auth = { 'Authorization' : 'Bearer ' +  user['auth'].encode('ascii', 'ignore') }        
	data = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = auth)
	days = json.loads(data.text)['data']['items']
	for day in days:
		date =  day['date']
		day = day['details']['hourly_totals']
		steps = 0
		for hour in day.keys():
			steps += day[hour]['steps']
		obj = { 'metric': 'motion', 'name' : username, 'date': date, 'value' : steps}
		if motion.find_one(obj) == None:
			motion.insert(obj)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)


