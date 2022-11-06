vertexes = []
faces = []
rf = open("Benchy.obj", "r")

teapot = rf.read().split("\n")
for line in teapot:
	lineArr = line.split(" ")
	if len(lineArr) < 3: continue
	# if lineArr[0] == "v": vertexes.append(list(map(float, lineArr[1:])))
	elif lineArr[0] == "f": faces.append(list(lineArr[1:]))

# print(sum(map(float,array))/len(array))

lines = []

# f 3//1 1//1 2//1
# f 4//2 3//2 2//2
# f 5//3 4//3 2//3
# f 6//4 5//4 2//4
# f 2//5 7//5 6//5

for i in range(len(faces)):
	for n in range(len(faces[i])):
		# temparr = list(map(int, faces[i][n].split("//")))
		line = [int(faces[i][n-1].split("//")[0]), int(faces[i][n].split("//")[0])]
		if line not in lines: 
			lines.append(line)
		
		# line = [int(temparr[0]), int(temparr[1])]
		# if line not in lines: lines.append(line)




	# line = [int(faces[i][1]), int(faces[i][2])]
	# if line not in lines: lines.append(line)

	# line = [int(faces[i][2]), int(faces[i][0])]
	# if line not in lines: lines.append(line)


open("benchy_out.txt", "w").write("["+str(vertexes)+","+ str(lines)+"]")
