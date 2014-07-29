from calendar import timegm as epochTime
from time import gmtime as epochFirst
from os import makedirs as makeDirectory

class newUserLib:
	def __init__(self, newUserUsername, newUserFullname, databaseUserCollection):
		self.newUserUsername = newUserUsername + str(epochTime(epochFirst()))
		self.newUserFullname = newUserFullname
		self.databaseUserCollection = databaseUserCollection

	def createUser(self):
		userTemplateJSON = { "name" : self.newUserFullname, "username" : self.newUserUsername, "metrics" : { "sleep" : { "source" : "file", "format" : ["percentage", 8, "hours"], "path" : ["mongo/data/db/", "sleep"], }, "weather" : { "source" : "custom", "format" : ["graph", "&deg; C"], "type" : "weather", "location" : "ksfo", }, "pictures" : { "source" : "file", "format" : ["picture"], "path" : ["mongo/data/db/", "pictures"], }, "motion" : { "source" : "custom", "format" : ["percentage", 400, "steps"], "type" : "jawbone", "auth" : "b6_3pfGGwEjReOXSnWIyQO0-Al13wvvmyZNaiuNHtPrR6_kAcLtg_W1PaWiav9FR8EvaJSumcI0GoYT-V9UbpVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP" } } }
		self.databaseUserCollection.insert(userTemplateJSON)
		makeDirectory("mongo/data/db/" +  self.newUserUsername + "/")
		makeDirectory("mongo/data/db/" +  self.newUserUsername + "/pictures")
		makeDirectory("mongo/data/db/" +  self.newUserUsername + "/sleep")



