//*******************************************************
//Block, that contains function to draw letter and save it to server
//*******************************************************
// Variables to keep track of the mouse position and left-button status 
var mouseX,mouseY,mouseDown=0;
// Variables to keep track of the touch position
var touchX,touchY;
// Variable storing the current letter to draw
var current_letter;
//draw path
function draw(x,y,fMove) {
       if(!fMove){
        //$(svg).append($("<path id='cur_path'></path>"));
        $(svg).append(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        path=$(svg).find("path:last-child");
        path.attr({"d": "M"+x+","+y+"L"+x+","+y,
                  "stroke-width":5,
                 "fill": "transparent",
                 "stroke":"black",
                 "stroke-linecap":"round"
            });
        }
       else
       {
            path=$(svg).find("path:last-child");
            path.attr("d",path.attr("d")+"L"+x+","+y);
       } 
       //console.log(x+" "+y)
}
//get mouse position     
function getMousePos(e) {
    
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }

    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
    
}

// Keep track of the mouse button being pressed and draw a dot at current location
function svg_mouseDown() {
    mouseDown=1;
    draw(mouseX,mouseY);
}
// Keep track of the mouse button being released
function svg_mouseUp() {
    mouseDown=0;
}
// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function svg_mouseMove(e) { 
    // Update the mouse co-ordinates when moved
    getMousePos(e);
    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown==1) {
        draw(mouseX,mouseY,true);
    }
}

// Get the touch position relative to the top-left of the svg
function getTouchPos(e) {
    if (!e)
        var e = event;
    if(e.originalEvent.touches) {
        if (e.originalEvent.touches.length == 1) { // Only deal with one finger
            var touch = e.originalEvent.touches[0]; // Get the information for finger #1
            touchX=touch.pageX-$("#draw-letter-area").offset().left;//-touch.target.offsetLeft;
            touchY=touch.pageY-$("#draw-letter-area").offset().top;//-touch.target.offsetTop;
        }
    }
}

//Initiation of the drawing area
function init() {

        //generate Random letter
        //generateLetter();
         $("#dr-letter").html(randletter());    
        console.log('Letter generate ok');
        // Get the specific canvas element from the HTML document
        svg = $("#draw-letter-area svg");
    
        // Check that we have a valid context to draw on/with before adding event handlers
        if (svg) {
            
            window.addEventListener('mouseup', svg_mouseUp, false);

            // React to touch events on the svg
            svg.bind('mousemove', function (e){
                getMousePos(e);
                // Draw a dot if the mouse button is currently being pressed
                if (mouseDown==1) {
                    draw(mouseX,mouseY,true);
                }
            });

            svg.bind('mouseup', function (e){
                 mouseDown=0;
            });

            svg.bind('mousedown', function (e){
                mouseDown=1;
                draw(mouseX,mouseY);
            
            });

            svg.bind('touchstart', function (e){
                getTouchPos(e);
                draw(touchX,touchY);
                // Prevents an additional mousedown event being triggered
                event.preventDefault();

            });
            
            svg.bind('touchmove', function(e){
                // Update the touch co-ordinates
                getTouchPos(e);
                // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
                draw(touchX,touchY,true); 
                // Prevent a scrolling action as a result of this touchmove triggering.
                event.preventDefault();
            });
        }
    }

//Save svg to image function
function save_to_image(){
    //disable buttons to prevent user double click
    $("#submitbutton").attr("disabled","disabled");
    $("#clearbutton").attr("disabled","disabled");
    $("#finishbutton").attr("disabled","disabled");
    
    console.log("Save Image Event");
    //get the svg 
    var svg = $.trim(document.getElementById("draw-letter-area").innerHTML);

    //check if there is canvas
    var canvas=document.getElementById("#canvas");
    if (canvas==null || canvas==undefined){
        //create canvas
        var canvas = document.createElement('canvas');
        
        canvas.id = "canvas";
        canvas.height = "278";
        canvas.width = "278";
        
        document.body.appendChild(canvas);
    }

    //Load the canvas element with our svg
	canvg(document.getElementById('canvas'), svg);

    var dataURL = canvas.toDataURL();

    $.ajax({
            type: "POST",
            url: "script.php",
            data: { 
                    imgBase64: dataURL,
                    letter: $("#dr-letter").html()
                   }
            }).done(function(o) {
                console.log('saved'); 
                //get number of letters
                let_count=parseInt($("#usercount").val());
                $("#usercount").val(let_count+=1)
                //generateLetter();
                randletter();
                console.log('generate new letter');
                
            });
        //enable controls
        $("#submitbutton").removeAttr("disabled");
        $("#clearbutton").removeAttr("disabled");
        $("#finishbutton").removeAttr("disabled");

}
//generate random letter 
function generateLetter(){

       //var fCyr=false;

        //if(sLang=="?ru") fCyr=true;

        $.ajax({
            type: "POST",
            url: "letter.php",
          //  data: {  cyr: fCyr},
            success: function(data, textStatus) {
                $("#dr-letter").html(data);    
                console.log('Letter generate ok');
            },
            error: function() {
                console.log('Letter generate error');}});

}
//*******************************************************
//Block that contains functions to validate and send user data
//*******************************************************

//show user data form
function showfinalform(){
    //hide drawing area
    $("#draw-container").hide();
    //show user form
    $("#finalform").show();
}

//validate and send data to server
function validatefinalform(){
    $("#finalformbutton").attr("disabled","disabled");

    //todo:addvalidation
    if($("#finalform .error").length==0)
    {
            //send to server
                $.ajax({
                    type: "POST",
                    url: "saveuserdata.php",
                    data: { 
                            name: $.trim($("#username").val()),
                            email: $("#usermail").val(),
                            count: $("#usercount").val()
                            }
                    }).done(function(o) {
                        console.log('User data saved');
                        $("#finalform").html("Thank you for participation!")
                    });
    }
    $("#finalformbutton").removeAttr("disabled");
    
}

//user E-mail validation
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) 
       { $("#usermail ").removeClass("error");
        return true;}
    else
       { $("#usermail ").addClass("error");
       return false;}
    }

function randletter()
{

    var text = "";
    var possible="";
    if (location.search=='?ru')
        possible = "БГДЖЗИЛФХЦЧЩШЬЪЭЮЯ";
    else 
        possible="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 1; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}