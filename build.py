import re

output = ''
for line in open('index.html'):
	resultJs = re.search('<script type="text/javascript" src="(.*?)"></script>', line)
	resultCss = re.search('<link rel="stylesheet" type="text/css" href="(.*?)">', line)
	if resultJs:
		fileName = resultJs.group(1)
		output += '<script type="text/javascript">' + open(fileName).read() + '</script>'
	if resultCss:
		fileName = resultCss.group(1)
		output += '<style type="text/css">' + open(fileName).read() + '</style>'
	else:
		output += line

f = open('notes-practice.html', 'w')
f.write(output)
f.close()
