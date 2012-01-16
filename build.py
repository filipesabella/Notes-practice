import re

output = ''
def inline (result, template):
	fileName = result.group(1)
	print 'Inlining', fileName
	return template.format(open(fileName).read())

for line in open('index.html'):
	resultJs = re.search('<script type="text/javascript" src="(.*?)"></script>', line)
	resultCss = re.search('<link rel="stylesheet" type="text/css" href="(.*?)">', line)
	if resultJs:
		output += inline(resultJs, '<script type="text/javascript">{0}</script>')
	elif resultCss:
		output += inline(resultCss, '<style type="text/css">{0}</style>')
	else:
		output += line

f = open('notes-practice.html', 'w')
f.write(output)
f.close()
