from calendar import timegm as epochTime
from time import gmtime as epochFirst
from os import makedirs as makeDirectory

class newUserLib:
	def __init__(self, newUserUsername, newUserFullname, newUserSleep, newUserMotion, databaseUserCollection):
		self.newUserUsername = newUserFullname.replace(' ', '') + str(epochTime(epochFirst()))
		self.newUserTargets = [eval(newUserSleep), eval(newUserMotion)]
		self.newUserFullname = newUserFullname
		self.databaseUserCollection = databaseUserCollection

	def createUser(self):
		userTemplateJSON = { 'name' : self.newUserFullname, 'username' : self.newUserUsername, 'metrics' : { 'sleep' : { 'order' : 2, 'source' : 'file', 'format' : ['percentage', self.newUserTargets[0], 'hours'], 'path' : ['mongo/data/db/user/', 'sleep'], }, 'weather' : { 'order' : 3, 'source' : 'custom', 'format' : ['graph', '&deg; C'], 'type' : 'weather', 'location' : 'ksfo', }, 'pictures' : { 'order' : 4, 'source' : 'file', 'format' : ['picture'], 'path' : ['mongo/data/db/user/', 'pictures'], }, 'motion' : { 'order' : 1, 'source' : 'custom', 'format' : ['percentage', self.newUserTargets[1], 'steps'], 'type' : 'jawbone', 'auth' : 'b6_3pfGGwEjReOXSnWIyQO0-Al13wvvmyZNaiuNHtPrR6_kAcLtg_W1PaWiav9FR8EvaJSumcI0GoYT-V9UbpVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP' } } }
		self.databaseUserCollection.insert(userTemplateJSON)
		makeDirectory('mongo/data/db/user/' +  self.newUserUsername + '/')
		for metric in userTemplateJSON['metrics']:
			tempMetric = userTemplateJSON['metrics'][metric]
			if (tempMetric['source'] == 'file'):
				makeDirectory(tempMetric['path'][0] +  self.newUserUsername + '/' + tempMetric['path'][1])		
		return self.databaseUserCollection.find_one({ 'username' : self.newUserUsername})

class deleteUserLib:
	def __init__(self, deleteUserUsername, dataBaseUserCollection):
		self.deleteUserUsername = deleteUserUsername
		self.dataBaseUserCollection = dataBaseUserCollection

	def deleteUser(self):
		deleteKey = { 'username' : self.deleteUserUsername }
		if (self.dataBaseUserCollection.find_one(deleteKey) != None):
			self.dataBaseUserCollection.remove(deleteKey)
