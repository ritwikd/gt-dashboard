from os import listdir
import requests

class rawFileLib():
	def __init__(self, userFileDirectory):
		self.userFileDirectory = userFileDirectory

	def getFileData(self):
		userFilePath = listdir(self.userFileDirectory)[0]
		userFileData = ""
		userFileData = open(self.userFileDirectory + "/" + userFilePath, "r").read().strip().replace("'", '"')
		return userFileData

class singleNumberLib:
	def __init__(self, userFileDirectory):
		self.userFileDirectory = userFileDirectory

	def getFileData(self):
		userFileData = ""; 
		userFilePaths = listdir(self.userFileDirectory)
		if len(userFilePaths) == 0:
			return userFileData
		userFilePath = userFilePaths[0]
		userFileData = eval(open(self.userFileDirectory + "/" + userFilePath, "r").read().strip())
		return userFileData

class multipleNumberLib:
	def __init__(self, userFileDirectory):
		self.userFileDirectory = userFileDirectory

	def getFileData(self):
		userFileDataPoints = []
		userFilePaths = listdir(self.userFileDirectory)
		if len(userFilePaths) == 0:
			return userFileDataPoints
		userFilePath = userFilePaths[0]
		userFileData = open(self.userFileDirectory + "/" + userFilePath, "r").read()
		userFileDataPoints = [eval(number.strip()) for number in userFileData.splitlines()]
		return userFileDataPoints

class pictureFileLib:
	def __init__(self, userFileDirectory):
		self.userFileDirectory = userFileDirectory

	def getFileData(self):
		userFilePaths = listdir(self.userFileDirectory)
		userFileData = []
		userFileFileHandler = None;
		for userFilePath in userFilePaths:
			userFileFileHandler = open(self.userFileDirectory + "/" + userFilePath, "r")
			userFileData.append(userFileFileHandler.read().encode("base64"))
		return userFileData

