?//



//BreakLagoPlaceHolders.jsx
// version 1.0
//An InDesign CS6 JavaScript
/*  
Dev: TimothyJ. Kleszczewski 
oct 2014

  
  
This script allows the user to break all the lago place holders on a page by first getting any manual kerning then replacing the text with its self and setting any manual kerning values
*/
// main code
main ();
function main (){
    var myStories = app.activeDocument.stories;
    
    checkForAnchoredObjs()
    
    
    myGetAllChars = getAllChars(myStories)
    myKerning = getMyKernValues(myGetAllChars)   
    myBreakPlaceholders = breakPlaceholders(myStories)
       
    getMyStories(myStories)


    alert ('DONE', 'DONE')
    }

//
function checkForAnchoredObjs(){
    var a = app.activeDocument.allPageItems, t;        
    while( t = a.pop()) {  
    if( t.isValid &&  t.hasOwnProperty('anchoredObjectSettings') &&  
        (t.parent instanceof Character) &&  (t=t.anchoredObjectSettings).isValid){
    //alert ('this page contains anchored Objects. Click ok to continue if you wish to release the anchored Objects and continue to break lago placeholders', 'contains anchoredObject ')
    windowAnchoredObjs()
        }
    }
}
function windowAnchoredObjs(){
    var myWindow = new Window ("dialog", "Form");
    myWindow.orientation = "row";
    myWindow.add ("statictext", undefined, "Warning:");
    var myText = myWindow.add ("staticText", undefined, "this page contains anchored Objects. \n  If you wish to release the anchored objects  \n and continue to break lago placeholders click OK");
    myWindow.add ("button", undefined, "OK");
    myWindow.add ("button", undefined, "Cancel");
    myWindow.show ();
    if (myWindow.show () == 1){
    anchoredObjRelease()
    }
    else{
    exit ();
    break
    }
}
function anchoredObjRelease(){

    var a = app.activeDocument.allPageItems, t;  
      
    while( t = a.pop() )  
    
        {  
        t.isValid &&  
        t.hasOwnProperty('anchoredObjectSettings') &&  
        (t.parent instanceof Character) &&  
        (t=t.anchoredObjectSettings).isValid &&  
        t.releaseAnchoredObject();  
        } 
}

function getMyKernValues(x){
    var myKernValues = [];
    for(var i = 0; i < x.length; i++){
                    try{
            myKernValues.push(x[i].kerningValue)
                }catch(_){
                    myKernValues.push(0)
                    }
        }
    return myKernValues
 }        
function getMyStories(myStories){
    var x;
    var count;
    for(var i = 0; i < myStories.length; i++){
       if (x === undefined) {
            count = 0
                } else {
                    count = x
                }
        story = myStories[i] 
        x = setLineKerning(story,  myKerning, count)
        }
}
function setLineKerning (story,   myKernVals, count){          
    for (var line = 0;  line < story.lines.length ; line++){   
        for (var j = 0;  j < story.lines[line].length; j++){
            if(myKernVals[count] != 0 ){
            //x = myKernVals[count]
            story.lines[line].characters[j].kerningValue = myKernVals[count] ;  
            count = count + 1
            }else{count = count + 1}
                }    
            }
    return count
}
    
function getAllChars (myStories){ 
    var ch = []
     for(var count = 0; count < myStories.length; count++){
        story = myStories[count]      
        var x = story.characters.everyItem().getElements();
             for(var i = 0; i < x.length; i++){
                ch.push(x[i])
        }

       }
    return ch;
    }





function breakPlaceholders(myStories){
 for(var count = 0; count < myStories.length; count++){
    story = myStories[count]
    var myLines = story.lines.everyItem().getElements();  
    $.writeln('myLines ', myLines.length)
    for(i=0; i<myLines.length; i++) {  
        if(myLines[i].contents.match(/^\r/) !=null)    { 
            continue;  
            }  
                 try{  
                        app.select(myLines[i].characters.itemByRange(0, -2));  
                        myString = app.selection[0].contents;   
                        myString = myString.split("").join("");    
                        app.selection[0].contents = myString; 
                    } catch(e){}  
    }
}
}
