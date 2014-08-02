from subprocess import call

def runCommand(command):
	call(command, shell=True)

fileHandler = open("VERSION")
buildVersion = fileHandler.read().rstrip()
fileHandler.close()


runCommand("rm -Rf .git")
runCommand("rm -Rf wiki")
runCommand("cd .. && tar -czf gt-dashboard." + buildVersion + ".tar.gz gt-dashboard/") 
