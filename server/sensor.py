import threading, requests, json, nltk
from time import strftime as gtime
from datetime import datetime
from os import listdir


def writeData(user, date):
    metrics = user['metrics']
    for metric in metrics:
	print metrics[metric]
	if metrics[metric]['source'] == 'file':
		filePath = metrics[metric]['path'][0] + user['username'] + '/' + metrics[metric]['path'][1]
		if metrics[metric]['format'] == 'percentage':
			
							
