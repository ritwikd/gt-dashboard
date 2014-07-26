import threading, requests, json, nltk
from time import strftime as gtime
from datetime import datetime
from os import listdir


def writeData(user, date, db):
    metrics = user.metrics
    print user.metrics 
