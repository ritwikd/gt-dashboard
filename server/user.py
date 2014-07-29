from calendar import timegm as epochTime
from time import gmtime as epochFirst

class newUserLib
	def __init__(self, newUserUsername, databaseUserCollection):
		self.newUserUsername = newUserUsername + epochTime(epochFirst)

	def createUser(self):
		userTemplateJSON = { "name" : "Ritwik Dutta", "username" : self.newUserUsername, "metrics" : { "sleep" : { "source" : "file", "format" : ["percentage", 8, "hours"], "path" : ["mongo/data/db/", "sleep"], }, "weather" : { "source" : "custom", "format" : ["graph", "&deg; C"], "type" : "weather", "location" : "ksfo", }, "pictures" : { "source" : "file", "format" : ["picture"], "path" : ["mongo/data/db/", "pictures"], }, "motion" : { "source" : "custom", "format" : ["percentage", 400, "steps"], "type" : "jawbone", "auth" : "b6_3pfGGwEjReOXSnWIyQO0-Al13wvvmyZNaiuNHtPrR6_kAcLtg_W1PaWiav9FR8EvaJSumcI0GoYT-V9UbpVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP" } } }
		databaseUserCollection.insert(userTemplateJSON)
		os.makedirs("mongo/data/" +  self.newUserUsername + "/")
		os.makedirs("mongo/data/" +  self.newUserUsername + "/pictures")
		os.makedirs("mongo/data/" +  self.newUserUsername + "/sleep")



