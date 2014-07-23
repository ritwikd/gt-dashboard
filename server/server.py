from flask import Flask, make_response, request, current_app
from functools import update_wrapper
from pymongo import MongoClient
from datetime import timedelta
import requests
import sensor
import json

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
print users

@app.errorhandler(404)
@app.route('/<username>')
@crossdomain(origin='*')
def getDate(username):
    user = users.find_one({'name' : username})
    if request.args.get('type') == 'user':
        if (user == None):
            return json.dumps({'name' : 'null' }), 404
        else:
            del(user['_id'])
            return json.dumps(user)
    elif request.args.get('type') == 'data':
        metric = request.args.get('metric')
        date = request.args.get('date')
        data = db[metric].find_one({'metric' : metric, 'name' : username, 'date': eval(date)})
        if (data == None):
            return json.dumps({'metric' : metric, 'name' : username, 'date' : eval(date), 'value' : 'null'})
        del(data['_id'])
        return json.dumps(data)
    elif request.args.get('type') == 'write':
        if (user != None):
            sensor.writeData(user, eval(request.args.get('date')), db)
        return 'Data written.'
    else:
        return 'Error.'

if __name__ == '__main__':
    autoWriteData(users, data, db)
    app.run(host='0.0.0.0', port=8081, debug=True)
