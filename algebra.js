var mainquery = ""

var stopwords = ["select", "from", "where", "group by", "sort by"];

var datastructure = {}

function algebra(query) {
    mainquery = query.toLowerCase().trim();
    datastructure = {
        "projection": [],
        "selection": [],
        "tables": []
    }

    projection();
    tablename();
    selection();
    var anwser = "```answer := ";
    
    if (datastructure["projection"]) {
        anwser += "P(" + datastructure["projection"].join(", ") + ")(";
    }
    
    if (datastructure["selection"]) {
        anwser += "S " + datastructure["selection"].join(" n ") + " (";
    }
    
    anwser += datastructure["tables"].join(" X ");
    
    if (datastructure["selection"]) {
        anwser += ")";
    }
    
    if (datastructure["projection"]) {
        anwser += ")";
    }
    return anwser + "```";
}

function projection() {
    if (mainquery.indexOf("select") > -1) {
        var ns = subuntilnextstop().substr(7).replace(/ /g, "");
        if (ns != "*") {
            datastructure["projection"] = ns.split(",");
        }
    }
}

function tablename() {
    if (mainquery.indexOf("from") > -1) {
        var ns = subuntilnextstop().substr(5).replace(/ /g, "");
        datastructure["tables"] = ns.split(",");
    }
}

function selection() {
    if (mainquery.indexOf("where") > -1) {
        var ns = subuntilnextstop().substr(6).replace(/ /g, "");
        datastructure["selection"] = ns.split("and");
    }
}

function subuntilnextstop() {
    var currentstate = 9999;
    stopwords.forEach(stop => {
        var location = mainquery.indexOf(stop);
        if (location > 1 && location < currentstate) {
            currentstate = location;
        }
    });
    if (currentstate == 9999) {
        currentstate = mainquery.length;
    }
    var newquery = mainquery.substr(0, currentstate);
    mainquery = mainquery.substr(newquery.length);
    return newquery.trim();
}

module.exports = algebra;