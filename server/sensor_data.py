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
		if metrics[metric]['source'] == 'file':
			filePath = metrics[metric]['path'][0] + username + '/' + metrics[metric]['path'][1]
			dbMetricCollection = db[metric]

			if metrics[metric]['format'][0] == 'percentage':
				fileDataObject = standard.singleNumberLib(filePath)
				fileData = "";
				fileData = fileDataObject.getFileData()				
				if fileData == None:
					fileData = ""
				dbInsertObject['value'] = eval(fileData)

			elif metrics[metric]['format'][0] == 'graph':
				fileDataObject = standard.multipleNumberLib(filePath)
				fileData = "";
				fileData = fileDataObject.getFileData()				
				if fileData == None:
					fileData = ""
				dbInsertObject['value'] = fileData

			elif metrics[metric]['format'] == 'raw':
				fileDataObject = standard.rawFileLib(filePath)
				fileData = "";
				fileData = fileDataObject.getFileData()				
				if fileData == None:
					fileData = ""
				dbInsertObject['value'] = fileData

			else metrics[metrics]['format'] == 'picture':
				fileDataObject = standard.pictureFileLib(filePath)
				fileData = "";
				fileData = fileDataObject.getFileData()				
				if fileData == None:
					fileData = ""
				dbInsertObject['value'] = fileData

		dbMetricCollection.insert(dbInsertObject)

