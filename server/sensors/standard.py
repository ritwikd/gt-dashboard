from os import listdir

class rawFileLib():
	def __init__(self, userFileDirectory):
		self.userFileDirectory = "../../" + userFileDirectory

	def getFileData(self):
		userFilePath = listdir(self.userFileDirectory)[0]
		userFileData = ""
		userFileData = open(userFilePath, "r").read()
		return userFileData

class singleNumberLib:
	def __init__(self, userFileDirectory):
		self.userFileDirectory = "../../" + userFileDirectory

	def getFileData(self):
		userFilePath = listdir(self.userFileDirectory)[0]
		userFileData = ""; 
		userFileData = eval(open(userFilePath, "r").read().strip())
		return userFileData

class multipleNumberLib:
	def __init__(self, userFileDirectory):
		self.userFileDirectory = "../../" + userFileDirectory

	def getFileData(self):
		userFilePath = listdir(self.userFileDirectory)[0]
		userFileData = open(userFilePath, "r").read()
		userFileDataPoints = []
		userFileDataPoints = [eval(number.strip()) for number in userFileData.splitlines()]
		return userFileDataPoints

class pictureLib:
	def __init__(self, userFileDirectory):
		self.userFileDirectory = "../../" + userFileDirectory

	def getPictures(self):
		userPicturePaths = listdir(self.userFileDirectory)
		userPictureData = []
		userPictureFileHandler = None;
		for userPicturePath in userPicturePaths:
			userPictureFileHandler = open(self.userFileDirectory + userPicturePath, "r")
			userPictureData.append(userPictureFileHandler.read().encode("base64"))
		return userPictureData

