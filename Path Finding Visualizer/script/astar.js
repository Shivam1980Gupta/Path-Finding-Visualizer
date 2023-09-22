
// About A* :  it is informed search technique
// It is slight updated version of Dijkstra which used Heuristic value to find shortest path in less time and computation. It si faster than dijkstra and mainly used in gameplay engineering and AI. Applicable in both directed and undirected graph and ensure optimal solution (represented by * in A*)

// Based on function 
        // F(n) = G(n)+H(n)
        // where G(n) is actual cost from start node to node "n"
        // and H(n) = Heuristic value = estimate cost from "n" to end node (find using diff, algo like bfs,dfs, etc)
        // ans F(n) is estimate cost from start node to end node via node "n"


var Data;
var Queue = [];
var visited = [];
var found = false;
var totalPath = [];

//Implementing Dijkstra Visualization
export function Astar(arrayData,startNode,endNode,SPEED){
    //Initialization
    Data = new Array(2);
    Data = arrayData;
    Queue = [];
    visited = [];
    found = false;
    totalPath = [];

    //console.log(Data[0][0]);
    let f1,f2 = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if(Data[i][j].id==startNode){
                startNode = Data[i][j];
                f1=true;
            }
            if(Data[i][j].id==endNode){
                endNode = Data[i][j];
                f2 = true;
            }
        }
        if(f1 && f2){
            break;
        }
    }

    //Calculating Heuristic
    calculateHeuristic(Data, startNode, endNode)
    //console.log(Data);

    //Astar
    Astarcode(Data,startNode,endNode, totalPath, visited);
    //console.log(Data);
    //console.log(visited);
    //console.log(totalPath);
    for (var i = 0; i < visited.length; i++) {
        let x = visited[i];
        //console.log(x+"==="+stop);
        if(x!=endNode.id){
            setTimeout(function(){
                $("#"+x).addClass("animate");
            },(i+1)*20*SPEED);
        }
    }
    if(!found){
        setTimeout(function(){
            alert("Not Found");
            $("#wall").removeAttr('disabled');
            $("#clear").removeAttr('disabled');
            $("#size").removeAttr('disabled');
            $("#speed").removeAttr('disabled');
            $("#start").removeAttr('disabled');
        },(i+2)*20*SPEED+700);
    }else{
        AstarPath(totalPath,i,visited.length,SPEED);
    }

}

//Trace Path
function tracePath(prevSource, currentNode, startNode, totalPath, Data){
    let val = currentNode;
    while(val.source != startNode.id){
        totalPath.push(val.source);
        val = val.neighbors.filter(item => item.id == val.source)// filter out only source node
        val = val[0];
    }
    //console.log(totalPath);
}

//Calculate Heuristic
function calculateHeuristic(Data, startNode, endNode){
    //console.log(startNode.i+","+startNode.j);
    //console.log(endNode.i+","+endNode.j);
    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
           Data[i][j].heuristic = Math.abs(Data[i][j].i-endNode.i) + Math.abs(Data[i][j].j-endNode.j);
        }
    }
}

function Astarcode(Data, startNode, endNode, totalPath, visited){

    //Astar
    //Setting Starting Node distance to 0
    startNode.distance = 0;

    //Pushing startNode to the Queue
    Queue.push(startNode);

    while(Queue.length!=0){
        //console.log(Queue);
        //Calculating minimum f-score
        var current;
        var min = Infinity;
        for (let i = 0; i < Queue.length; i++) {
            if((Queue[i].distance + Queue[i].heuristic) < min){
                min = Queue[i].distance + Queue[i].heuristic;
                current = Queue[i]
            }
        }

        //If element is finished
        //console.log(current)
        //console.log(endNode)
        if(current === endNode){
            found = true;
            return tracePath(current.source, current, startNode, totalPath, Data);
        }

        //Popping the element current from the Queue
        Queue = Queue.filter(item => item.id != current.id);
        //console.log(current.neighbors);

        for (let i = 0; i < current.neighbors.length; i++) {
            var f = current.distance + 1 //Storing the distance
            if(f < current.neighbors[i].distance){
                current.neighbors[i].source = current.id;
                current.neighbors[i].distance = f;
                current.neighbors[i].function = current.neighbors[i].distance + current.neighbors[i].heuristic;
                if(Queue.indexOf(current.neighbors[i]) == -1){
                    // not in queue then push it
                    Queue.push(current.neighbors[i]);
                }
                //Animate
                visited.push(current.neighbors[i].id);
            }

        }
        //console.log(visited);

    }
    return false;
}

function AstarPath(path, frames, nodes, speed){
    for (var i = path.length-1; i >=0; i--) {
        let x = path[i];
        //console.log(x+"==="+stop);
        setTimeout(function(){
            $("#"+x).addClass("path");
        },++frames*20*speed);
    }

    setTimeout(function(){
        alert("Path Found\nDistance : "+path.length+"\nNode visited after searching "+(nodes)+" nodes.");
        $("#wall").removeAttr('disabled');
        $("#clear").removeAttr('disabled');
        $("#size").removeAttr('disabled');
        $("#speed").removeAttr('disabled');
        $("#start").removeAttr('disabled');
    },(++frames+2)*20*speed+700);

}
