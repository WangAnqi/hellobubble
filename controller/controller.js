exports.getID = function(){
	newID = {"id":200};
    return newID;
}

exports.setIDName = function(data){
    
}

exports.setIDAction = function(data){

}

exports.setIDQuitGame = function(data){

}

exports.setIDEndGame = function(data){

}

exports.getIDMapAction = function(data){

}
//net --- server
/*
getID() ---return: a new id
setIDName(data) ---set id's name---data = {"id":10, "name":"dogedoge"}
setIDAction(data) --- set id's action --- data = {"id":510, "direction":"?","mouse":"w"}
setIDQuitGame(data) --- user temporarily quit the game, not end game --- data = {"id":203}
setIDEndGame(data) --- user end the game --- data = {"id":203}

getIDMapAction(id) --- return {'myx':50,'myy':100,'mysize':50,'id':20, 'live':true, 'map':[{'id':1,'x':20,'y':30,'size':10,'type':0,'name':'123'}]}
*/