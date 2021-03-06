from flask import Flask, make_response, request, current_app
from functools import update_wrapper
from time import strftime as gtime
from pymongo import MongoClient
from datetime import timedelta
import requests, sensor_data, json, user
from urllib2 import unquote

#Flask provided cross-domain request stuff
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

userDataBase = MongoClient('localhost', 27017)['data']
databaseUserCollection = userDataBase['users']


#Main handler
@app.errorhandler(404)
@app.route('/<userRequestUsername>')
@crossdomain(origin='*')
def getDate(userRequestUsername):
    userRequestUser = databaseUserCollection.find_one({'username' : userRequestUsername})

    if request.args.get('type') == 'user':
        if (userRequestUser == None):
            return json.dumps({'name' : 'null' }), 404
        else:
            del(userRequestUser['_id'])
            return json.dumps(userRequestUser)

    elif request.args.get('type') == 'data':
        #Get data from DB
        userRequestMetric = request.args.get('metric')
        currentServerDate = request.args.get('date')
        userRequestData = userDataBase[userRequestMetric].find_one({'metric' : userRequestMetric, 'username' : userRequestUsername, 'date': eval(currentServerDate)})
        if (userRequestData == None):
            return json.dumps({'metric' : userRequestMetric, 'username' : userRequestUsername, 'date' : eval(currentServerDate), 'value' : 'null'})
        del(userRequestData['_id'])
        return json.dumps(userRequestData)
    elif request.args.get('type') == 'users':
	userReturnInfo = { }
	for userRequestItem in databaseUserCollection.find():
		userReturnInfo[userRequestItem['username']] = userRequestItem['name']
        return json.dumps(userReturnInfo)
    elif request.args.get('type') == 'create':
	newUserFullname = unquote(request.args.get('fullname'))
	newUserSleep = request.args.get('sleep')
	newUserMotion = request.args.get('motion')
	createNewUserInstance = user.newUserLib(userRequestUsername, newUserFullname, newUserSleep, newUserMotion, databaseUserCollection)
	createdNewUser = createNewUserInstance.createUser()
	sensor_data.writeData(createdNewUser, userDataBase)
	return 'Created user successfully.'
    elif request.args.get('type') == 'delete':
	deleteUserInstance = user.deleteUserLib(userRequestUsername, databaseUserCollection)
	deleteUserInstance.deleteUser()
	return 'Deleted user successfully.'
    else:
        return 'Request type not recognized.'

if __name__ == '__main__':
    #Start automatically data
    autoWriteDataInstance = sensor_data.autoWriteDataLib(databaseUserCollection, userDataBase, 10)
    autoWriteDataInstance.runAutoLog()
    print 'Started automated data logging.' 
    app.run(host='0.0.0.0', port=8081, debug=True)
