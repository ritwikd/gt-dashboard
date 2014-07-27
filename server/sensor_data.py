import threading, requests, json, nltk
from time import strftime as gtime
from datetime import datetime
from os import listdir
import sys
sys.path.append('sensors')
from sensors import standard
from sensors import custom


def writeData(user, date, db):
    metrics = user['metrics']
    username = user['username']

    for metric in metrics:
    	dbInsertObject = { "date" : eval(gtime("%Y%m%d")), "username" : username, "metric" : metric}
	dbMetricCollection = db[metric]

	if metrics[metric]['source'] == 'file':
		filePath = metrics[metric]['path'][0] + username + '/' + metrics[metric]['path'][1]
	
		if metrics[metric]['format'][0] == 'percentage':
			print "Inserting percentage."
			fileDataObject = standard.singleNumberLib(filePath)
			fileData = "";
			fileData = fileDataObject.getFileData()				
			if fileData == None:
				fileData = ""
			dbInsertObject['value'] = fileData

		elif metrics[metric]['format'][0] == 'graph':
			print "Inserting graph."
			fileDataObject = standard.multipleNumberLib(filePath)
			fileData = "";
			fileData = fileDataObject.getFileData()				
			if fileData == None:
				fileData = ""
			dbInsertObject['value'] = fileData

		elif metrics[metric]['format'][0] == 'raw':
			print "Inserting raw."
			fileDataObject = standard.rawFileLib(filePath)
			fileData = "";
			fileData = fileDataObject.getFileData()				
			if fileData == None:
				fileData = ""
			dbInsertObject['value'] = fileData

		elif metrics[metric]['format'][0] == 'picture':
			print "Inserting pictures."
			fileDataObject = standard.pictureFileLib(filePath)
			fileData = "";
			fileData = fileDataObject.getFileData()				
			if fileData == None:
				fileData = ""
			dbInsertObject['value'] = fileData

	dbMetricCollection.insert(dbInsertObject)
	print "Data inserted."
