import sys
query = sys.argv[1].lower().strip()

stopwords = ["select", "from", "where", "group by", "sort by"]

datastructure = {
    "projection": [],
    "selection": [],
    "tables": []
}


def projection():
    if 'select' in query:
        ns = subuntilnextstop()[7:].replace(" ", "")
        if ns != "*":
            datastructure["projection"] = ns.split(',')


def tablenames():
    if 'from' in query:
        ns = subuntilnextstop()[5:].replace(" ", "")
        #add exception for naturl join later
        datastructure["tables"] = ns.split(',')


def selection():
    if 'where' in query:
        ns = subuntilnextstop()[6:].replace(" ", "")
        datastructure["selection"] = ns.split('and')



def subuntilnextstop():
    global query
    currentstate = 9999
    for test in stopwords:
        location = query.find(test)
        if (location > 1) and location < currentstate:
            currentstate = location
    if currentstate is 9999:
        currentstate = len(query)
    newquery = query[:currentstate]
    query = query[len(newquery):]
    return newquery.strip()

##parse
projection()
tablenames()
selection()


##final nested print
anwser = "anwser := "

if datastructure["projection"]:
    anwser += "P(" + ",".join(datastructure["projection"]) + ")("

if datastructure["selection"]:
    anwser += "S " + " n ".join(datastructure["selection"]) + " ("

anwser += " X ".join(datastructure["tables"])

if datastructure["selection"]:
    anwser += ")"

if datastructure["projection"]:
    anwser += ")"

print(anwser)
sys.stdout.flush()
