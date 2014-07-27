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
				percentageDataObject = standard.singleNumberLib(filePath)
				percentageData = "";
				percentageData = percentageDataObject.getFileData()				
				if percentageData == None:
					percentageData = ""
				dbInsertObject['value'] = eval(percentageData)

			elif metrics[metric]['format'][0] == 'graph':
				graphDataObject = standard.multipleNumberLib(filePath)
				graphData = "";
				graphData = graphDataObject.getFileData()				
				if graphData == None:
					graphData = ""
				dbInsertObject['value'] = graphData

			elif metrics[metric]['format'] == 'raw':
				rawDataObject = standard.rawFileLib(filePath)
				rawData = "";
				rawData = rawDataObject.getFileData()				
				if rawData == None:
					rawData = ""
				dbInsertObject['value'] = rawData

			else metrics[metrics]['format'] == 'picture':
				pictureDataObject = standard.pictureFileLib(filePath)
				pictureData = "";
				pictureData = pictureDataObject.getFileData()				
				if pictureData == None:
					pictureData = ""
				dbInsertObject['value'] = pictureData
		# dbMetricCollection.insert(dbInsertObject)

