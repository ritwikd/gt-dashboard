import threading, requests, json, nltk
from time import strftime as getFormattedTime
from datetime import datetime
from os import listdir

from sys import path as modules
modules.append('sensors')
from sensors import standard, custom


def writeData(givenUser, userDataBase):
    userMetricsList = givenUser['metrics']
    givenUserName = givenUser['username']

    for metric in userMetricsList:
    	dbInsertObject = { "date" : eval(getFormattedTime("%Y%m%d")), "username" : givenUserName, "metric" : metric}
	dbMetricCollection = userDataBase[metric]
	dbMetricCollection.remove(dbInsertObject)

	if userMetricsList[metric]['source'] == 'file':
		filePath = userMetricsList[metric]['path'][0] + givenUserName + '/' + userMetricsList[metric]['path'][1]
		fileData = ""

		if userMetricsList[metric]['format'][0] == 'percentage':
			print "Inserting percentage."
			fileDataObject = standard.singleNumberLib(filePath)
			fileData = fileDataObject.getFileData()				

		elif userMetricsList[metric]['format'][0] == 'graph':
			print "Inserting graph."
			fileDataObject = standard.multipleNumberLib(filePath)
			fileData = fileDataObject.getFileData()				

		elif userMetricsList[metric]['format'][0] == 'raw':
			print "Inserting raw."
			fileDataObject = standard.rawFileLib(filePath)
			fileData = fileDataObject.getFileData()				

		elif userMetricsList[metric]['format'][0] == 'picture':
			print "Inserting pictures."
			fileDataObject = standard.pictureFileLib(filePath)
			fileData = fileDataObject.getFileData()				
		

		if fileData == None:
				fileData = ""
		dbInsertObject['value'] = fileData

	elif userMetricsList[metric]['source'] == 'custom':
		customData = ""
		
		if userMetricsList[metric]['type'] == 'jawbone':
			customDataObject = custom.jawboneLib(userMetricsList[metric]['auth'])
			customData = customDataObject.getMetricData()
		elif userMetricsList[metric]['type'] == 'weather':
			customDataObject = custom.weatherLib(userMetricsList[metric]['location'])
			customData = customDataObject.getMetricData()
			
		if customDataObject == None:
			customData = ""
		dbInsertObject['value'] = customData

	dbMetricCollection.insert(dbInsertObject)
	print "Data inserted."


def writeAllUserData(databaseUserCollection, userDataBase):
	autoWriteDataLogHandler = open("auto.log", "a")
	for currentUser in databaseUserCollection.find():
		autoWriteDataLogHandler.write("Logging data for " + currentUser['username'] + " on " + getFormattedTime("%Y%m%d") + " at " + getFormattedTime("%H%M%S") + ".\n")
		writeData(currentUser, userDataBase)
	autoWriteDataLogHandler.close()


class autoWriteDataLib():
	def __init__(self, databaseUserCollection, userDataBase, dataLogInterval):
		self.databaseUserCollection = databaseUserCollection
		self.userDataBase = userDataBase
		self.dataLogInterval = dataLogInterval

	def runAutoLog(self):
		threading.Timer(self.dataLogInterval, self.runAutoLog).start()
		writeAllUserData(self.databaseUserCollection, self.userDataBase)
