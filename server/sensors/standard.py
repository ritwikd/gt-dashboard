class rawFileLib():
	def __init__(self, userFileLocation):
		self.userFileLocation = userFileLocation

	def getFileData():
		userFilePath = listdir(self.userFileLocation)[0]
		userFileData = ""
		userFileData = open(userFilePath, "r").read()
		return userFileData

class singleNumberLib:
	def __init__(self, userFileLocation):
		self.userFileLocation = userFileLocation

	def getFileData():
		userFilePath = listdir(self.userFileLocation)[0]
		userFileData = "";
		userFileData = eval(open(userFilePath, "r").read().strip())
		return userFileData

class multipleNumberLib:
	def __init__(self, userFileLocation):
		self.userFileLocation = userFileLocation

	def getFileData():
		userFilePath = listdir(self.userFileLocation)[0]
		userFileData = open(userFilePath, "r").read()
		userFileDataPoints = []
		userFileDataPoints = [eval(number.strip()) for number in userFileData.splitlines()]
		return userFileDataPoints

class pictureLib:
	def __init__(self, userFileLocation):
		self.userFileLocation = userFileLocation

	def getPictures():
		userPicturePaths = listdir(self.userFileLocation)
		userPictureData = []
		userPictureFileHandler = None;
		for userPicturePath in userPicturePaths:
			userPictureFileHandler = open(self.userFileLocation + userPicturePath, "r")
			userPictureData.append(userPictureFileHandler.read().encode("base64"))
		return userPictureData

