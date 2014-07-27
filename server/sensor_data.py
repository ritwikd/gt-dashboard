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
    for metric in metrics:
	if metrics[metric]['source'] == 'file':
		filePath = metrics[metric]['path'][0] + user['username'] + '/' + metrics[metric]['path'][1]
		if metrics[metric]['format'][0] == 'percentage':
			percentageDataObject = standard.singleNumberLib(filePath)
			percentageData = percentageDataObject.getFileData()				
			print percentageData
