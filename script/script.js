//Importing Algorithm
import {Dijkstra} from './dijkstra.js'
import {BreadthFirstSearch} from './bfs.js'
import {DepthFirstSearch} from './dfs.js'
import {Astar} from './astar.js'

$(document).ready(function () {
  //Set pevious State
  var SIZE = 22;
  var SPEED = 3;
  var ALGORITHM = 1;
  var startid, endid;
  var isDown = false;
  var wall = [];
  var uniqueId;
  var data = new Array(2);                                                            // ?? why 2 is used here

  //Initial Function
  displayGrid(SIZE);

  //Changing SPEED AND SIZE // run when range is changed
  $("[type=range]").change(function () {
    var newval = $(this).val();
    //console.log(newval);
    if (this.id == "speed") {
      $("#speed_dis").text(newval);
      SPEED = newval;
    } else {
      $("#size_dis").text(newval);
      SIZE = newval;
      startid = undefined;
      endid = undefined;
      displayGrid(SIZE);
    }
  });

  //Display grid Function
  function displayGrid(x) {
    $(".screen").html(" ");
    let screenWidth = $(".screen").innerWidth() / SIZE;

    for (let i = 0; i < x * x; i++) {
      $(".screen").append('<div class="unit" id="' + i + '"></div>');
    }

    $(".unit").css("width", screenWidth + "px");
    $(".unit").css("height", screenWidth + "px");
  }

  //Resize Event Handler
  // window resizing handling because you have added size*size small boxes in grid area. On window resizing they  may overflow OR get less in count (i.e.it is not a square matrix any more)
  $(window).on("resize", function () {
    displayGrid(SIZE);
    startid = undefined;
    endid = undefined;
  });

  //CHOOSE ALGORITHM
  $('select').on('change', function() {
      //console.log( this.value );
      let choice = this.value;
      if (choice == 1) {
        $(".title h1").text("Breadth First Search");
      } else if (choice == 2) {
        $(".title h1").text("Depth First Search");
      } else if (choice == 3) {
        $(".title h1").text("Dijkstra Algorithm");
      } else {
        $(".title h1").text("A* Algorithm");
      }
      ALGORITHM = choice;
  });

  //ONCLICK Handle Visualization [[[[[[Start]]]]]]]
  $("#start").on("click", function () {
    if (startid == undefined || endid == undefined) {
      alert("Select the starting and ending point.");
    } else {
      wallGenerate(); // get ids of all wall boxes // filling wall array (set as global array above)
      connectArray(SIZE);
      //Disable input field
      $("#wall").prop("disabled", true);
      $("#clear").prop("disabled", true);
      $("#size").prop("disabled", true);
      $("#speed").prop("disabled", true);
      $("#start").prop("disabled", true);
      decoder(ALGORITHM);
    }
  });

  //Handle algorithm visualization
  function decoder(algo) {
    SPEED = 6 - SPEED;                                                            // ?? what is this for?
    if (algo == 1) {
      BreadthFirstSearch(data,startid,endid,SPEED);
    } else if (algo == 2) {
      DepthFirstSearch(data,startid,endid,SPEED);
    } else if (algo == 3) {
      Dijkstra(data,startid,endid,SPEED);
    } else {
     Astar(data,startid,endid,SPEED);
    }
  }

  //Display---Animation---Onclick  // Double Click Function // unit is class for the box
 $("body").on("dblclick",".unit", function () {  
    //console.log(startid);
    //console.log(endid);
    // console.log(this); this => unit element that is doble clicked
    if (startid == undefined) {
      $(this).addClass("startTarget");                                                  // ?? target class use
      startid = $(this).attr("id");
    } else if (endid == undefined) {
      $(this).addClass("endTarget");
      endid = $(this).attr("id");
    } else {
      //pass;
    }
  });

  //Clear Cell
  $("#clear").on("click", function () {
    startid = undefined;
    endid = undefined;
    wall = [];
    $(".unit").addClass("restore");
    data = new Array(2);
    $(".unit").removeClass("animate");  // class for animated or visited node
    $(".unit").removeClass("startTarget"); // class for starting node
    $(".unit").removeClass("endTarget"); // class for ending node
    $(".unit").removeClass("wall");   // class for wall
    $(".unit").removeClass("path");   // path for shortest path
  });

  //Double Click Custom WALL Mouse Event
  
  $("body").on("mousedown", ".unit", function () {
    isDown = true;
    // console.log("mouse is down"); // MouseDown when mouse clicked but not released
  });

  $("body").on("mouseup", ".unit", function () {
    isDown = false;
    // console.log("mouse is up"); // MouseUP when mouse clicked is released
  });
  
  // Because we are use mouseOver event with isDown boolean to create wall. When clicked on box to create wall, that box will not get converted to wall but all other box over which we hover with mouse down will get converted to wall. that click is used to set isDown to true
  $("body").on("mouseover", ".unit", function () {
    if (isDown && $(this).css("background-color") != "rgb(38, 38, 38)") { // Starting and Ending Node can not be WALL
      if ($(this).css("background-color") === "rgb(1, 110, 253)") {
        // if already a wall
        $(this).addClass("restore");                                                //?? restore class use
        $(this).removeClass("wall");
      } else {
        // if not a wall 
        $(this).addClass("wall");
        $(this).removeClass("restore");
      }
      //console.log($(this).css("background-color"));
    }
  });

  // NOTE : since I apply mousedown and mouseup on "unit" class only there may chance user clicked and moved pointer out of grid without releasing, in that case isDown will remain turned on 
  // so used mouseleave event on screen (or grid)
  $("body").on("mouseleave", ".screen", function () {
        isDown = false;
  });

  //Making Wall on button Pressing WALL Button
  $("#wall").on("click", function () {
    wall = 0;
    for (let i = 0; i < SIZE * SIZE; i++) {
      if (i == startid || i == endid) {
        //pass
      } else {
        let x = Math.round(Math.random() * 10); // get random no. in range 0 to 100
        // console.log(i + "   " + x);
        if (x == 0 || x == 1 || x == 2) {
          $("#" + i).addClass("wall");
        }
      }
    }
    //console.log(wall);
  });

  //generating wall array on click
  function wallGenerate() {
    wall = []; // emptying wall array sothat previously set wall element get deleted
    for (let i = 0; i < SIZE * SIZE; i++) {
      let x = $("#" + i).css("background-color");
      if (x == "rgb(1, 110, 253)") { // checking by color code for wall OR can check by checking box id as "wall"
        wall.push(i);
      }
    }
    //console.log(wall);
  }

  //Generate Array of Given Size//Conerting Array to Graph
  function connectArray(size) {
    uniqueId = 0;

    //Making 2-D Array
    // data is 2d array so data[i] is 1D array
    for (let i = 0; i < size; i++) {
      data[i] = new Array(2);                                                           // ?? why 2 is used here 
    }

    
    //Initializing 2-D Array
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        //console.log(wall.indexOf(uniqueId))
        if(wall.indexOf(uniqueId)==-1){
          // checking whether uniqueIndex (= i+j) is present in wall array or not (is wall or not)
          data[i][j] = new Spot(i, j, false, uniqueId++);//increment uniqueId at every step
        }else{
          data[i][j] = new Spot(i, j, true, uniqueId++);//increment uniqueId at every step
        }
      }
    }
    
    // function to set neighbours of each box (or node)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        data[i][j].connectFrom(data);
      }
    }
    //console.log(data);
  }

    //Function to make neighbors
    function Spot(i,j,isWall,id){
      this.i = i;
      this.j = j;
      this.id = id;
      this.isWall = isWall;
      this.neighbors = [];
      this.path = [];
      this.visited = false;
      this.distance = Infinity;
      this.heuristic = 0; // assumed value (will be used in algorithm) // used in A* Algorithm
      this.function = this.distance + this.heuristic;
      this.source = "";

      this.connectFrom = function(data){
          var i = this.i;
          var j = this.j;
          if(i>0 && !(data[i-1][j].isWall)){
              this.neighbors.push(data[i-1][j])
          }
          if(i<SIZE-1 && !(data[i+1][j].isWall)){
              this.neighbors.push(data[i+1][j])
          }
          if(j>0 && !(data[i][j-1].isWall)){
              this.neighbors.push(data[i][j-1])
          }
          if(j<SIZE-1 && !(data[i][j+1].isWall)){
              this.neighbors.push(data[i][j+1])
          }
      }

  }


  //Make bfs dfs work ===> visual animate and path animate
  //Scope for the dijistra and algorithm
  //Scope of the the other algorithm to work

  //Applying Algorithm one-by-one

  //===============================
});
