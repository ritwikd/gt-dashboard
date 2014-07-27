import threading, requests, json, nltk
from time import strftime as gtime
from datetime import datetime
from os import listdir

from sys import path as modules
modules.append('sensors')
from sensors import standard, custom


def writeData(user, date, db):
    metrics = user['metrics']
    username = user['username']

    for metric in metrics:
    	dbInsertObject = { "date" : eval(gtime("%Y%m%d")), "username" : username, "metric" : metric}
	dbMetricCollection = db[metric]
	dbMetricCollection.remove(dbInsertObject)

	if metrics[metric]['source'] == 'file':
		filePath = metrics[metric]['path'][0] + username + '/' + metrics[metric]['path'][1]
		fileData = "";

		if metrics[metric]['format'][0] == 'percentage':
			print "Inserting percentage."
			fileDataObject = standard.singleNumberLib(filePath)
			fileData = fileDataObject.getFileData()				

		elif metrics[metric]['format'][0] == 'graph':
			print "Inserting graph."
			fileDataObject = standard.multipleNumberLib(filePath)
			fileData = fileDataObject.getFileData()				

		elif metrics[metric]['format'][0] == 'raw':
			print "Inserting raw."
			fileDataObject = standard.rawFileLib(filePath)
			fileData = fileDataObject.getFileData()				

		elif metrics[metric]['format'][0] == 'picture':
			print "Inserting pictures."
			fileDataObject = standard.pictureFileLib(filePath)
			fileData = fileDataObject.getFileData()				
		

		if fileData == None:
				fileData = ""
		dbInsertObject['value'] = fileData

	elif metrics[metric]['source'] == 'custom':
		customData = "";
		if metrics[metric]['type'] == 'jawbone':
			customDataObject = custom.jawboneLib(metrics[metric]['auth'])
			customData = customDataObject.getMetricData();
		elif metrics[metric]['type'] == 'weather':
			customDataObject = custom.jawboneLib(metrics[metric]['location'])
			customData = customDataObject.getMetricData();
			

		if customDataObject == None:
			customData = ""

		dbInsertObject['value'] = customDataObject

	dbMetricCollection.insert(dbInsertObject)
	print "Data inserted."


def autoWriteData(users, date, db):
	autoDataLogging = threading.Timer(1200, autoWriteData)
	autoDataLogFile = open("server/auto.log", "a")
	for user in users:
		autoDataLogFile.write("Logging data for " + user['username'] + " on " + gtime("%Y%m%d") + " at " + gtime("%H%M%S") + ".\n"))
		writeData(user, date, db)
	autoDataLogFile.close()