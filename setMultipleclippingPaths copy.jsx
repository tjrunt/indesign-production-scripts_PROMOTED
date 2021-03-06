?//setMultipleclippingPaths.jsx
// version 1.0
//An InDesign CS6 JavaScript
/*  
Dev: TimothyJ. Kleszczewski

  
  
This script allows the user to apply clipping paths to multiple images in an indesign document at once. You can choose to apply the paths to all images, selected images or all unselected images.
The first two path  options in the drop down list are  "NONE" and "Detect edges" this applies to all images. The  final path options  depend on the photoshop paths following the standard
schawk naming convention. "ol" and "ol+shd" any clipping paths not following the naming convention will be ignored. Of those options the option named will 'OL' will apply the path name ol , the option 
'OL+SHD (only)' will activate the path 'ol+shd' and the final option  'OL+SHD (make copy of image)' will set the clipping path to 'ol' (if it isn't currently) then make a copy, send it to the back and apply 
the "ol+shd" clippingpath and  then finally  group the images and set the shadow image to multiply. 
*/
main();
function main(){
    var myDoc = app.activeDocument;
    var images = myDoc.allGraphics;  
    
    // UI to get settings
    settings = uiPathSelection();
    
    var applyPathTO = settings.radioSelection;
    // thats chosen clipping path
    var choosenPath = settings.dropDownSelection;
    
    var doc = app.activeDocument;
    var sel  = doc.selection;

    var myselection = checkSelectionForImages(sel)
     inx = getimageIndex(images, myselection )
     tempArrry = []
     all = getimageIndex(images, tempArrry ) 
 
    if(applyPathTO == 'All images'){
        setPaths(images, all, choosenPath)  
        }
    
     else if(applyPathTO == 'Selected images'){
         setPaths(images, inx, choosenPath) 
     }
    
     else{
         //applyPathTO == 'UNSelected images')
         while(inx.length > 0){
            temp = inx.pop()
            myImageIndex = unslectedList(all,temp)
            }
            setPaths(images, myImageIndex, choosenPath)
          }   
  }

function uiPathSelection(){
    
    // shadow drop down
    var myWindow = new Window ("dialog", "Path");
    var myInputGroup = myWindow.add ("group");
    myInputGroup.alignChildren = "left";
    myInputGroup.add ("statictext", undefined, "Select Path to apply");
    var myDropdown = myWindow.add ("dropdownlist", undefined, ["NONE", "DETECT EDGES", "OL", "OL+SHD (only)", "OL+SHD (make copy of image)"]);
    myDropdown.selection = 2;  
   
    //  apply  path radio buttons
    var radio_group = myWindow.add ("panel");
    radio_group.add ("statictext", undefined, "Apply paths to:");
    radio_group.alignChildren = "left";
    radio_group.add ("radiobutton", undefined, "All images");
    radio_group.add ("radiobutton", undefined, "Selected images");
    radio_group.add ("radiobutton", undefined, "Unselected images");
    radio_group.children[1].value = true;
   
    // ok and cancel buttons
    var myButtonGroup = myWindow.add ("group");
    myButtonGroup.alignment = "right";
    myButtonGroup.add ("button", undefined, "OK");
    myButtonGroup.add ("button", undefined, "Cancel");
    
    //help_ = myButtonGroup.add ("button", undefined,  "help", {name: "help"});

    myButtons = myWindow.show ();

        // checks if user selects cancel
    	if(myButtons != true){
		    exit(0);
	}
    
    var x = ''
    for (var i = 0; i < radio_group.children.length; i++){
        if (radio_group.children[i].value == true){
            x = radio_group.children[i].text
    }
}  
       return { dropDownSelection: myDropdown.selection.text  ,  radioSelection: x}
    }

// list of unselected indexes to visit
function unslectedList(list, removeIndex){
    list = list
     for (var i = 0; i < list.length; i++){
         if(removeIndex == list[i]){
            tempList = list.splice (i, 1)
        }
    }
    return list
  }
//apply to   selected images
function getimageIndex(images, sel){
    var imageIndex = new Array        
     if(sel.length > 0){
        for (var count =0; count <sel.length; count++){
            for (var i =0; i < images.length; i++){
                //
                if(sel[count].graphics[0].itemLink.name ==  images[i].itemLink.name){
                    imageIndex.push(i);
                    }
                }
            }  
        }else{
            for (var count =0; count <images.length; count++){
                        imageIndex.push(count);
                        }                  
                }
     return imageIndex
    }

//
function checkSelectionForImages(imageArray){
    
// check that the selected image rectangle were selected and not the direct image. 
//  The obj type should be a rectangle if not get the parent object which should be a rectangle
    var newSel = new Array
    var cleanList = new Array
    var imagesArrayList = new Array

    for (var count =0; count < imageArray.length; count++){ 
        x = imageArray[count]
        if ( x.constructor.name == 'Image'){
            newSel.push(x);          
            }
        else if ( x.constructor.name == 'Rectangle'){
            newSel.push(x);                
            }         
        else{
            continue
            }
 } 
    for (var count =0; count < newSel.length; count++){ 
        if ( newSel[count].constructor.name == 'Image'){
            temp = imageArray[count].parent
            cleanList.push(temp);
    }else{
        temp = imageArray[count]
        cleanList.push(temp);
        }
 } 
        // final check if all the selected items are not rectangles  and contain an image  if not this will throw an error
        for (var count =0; count <cleanList.length; count++){ 
             try{
            x =  cleanList[count].graphics[0].itemLink.name
            imagesArrayList.push(cleanList[count]);
                }
            catch(err){
                continue
                    }              
                }
        return imagesArrayList
  }
// rewrite as case???
function setPaths(images,  myImageIndexList, choosenPath){
    if(choosenPath == 'NONE'){
         for (var count =0; count < myImageIndexList.length; count++){ 
             try{
             images[myImageIndexList[count]].clippingPath.clippingType = ClippingPathType.NONE;  
             }
                 catch(err ){continue}
            }
    }    
     else if(choosenPath == 'DETECT EDGES'){
        for (var count =0; count < myImageIndexList.length; count++){ 
  
         try{
         images[myImageIndexList[count]].clippingPath.clippingType = ClippingPathType.DETECT_EDGES;  
         }
             catch(err ){continue}
        }
         }
    
     else if(choosenPath == 'OL'){
        for (var count =0; count < images.length; count++){ 
             try{
             images[myImageIndexList[count]].clippingPath.appliedPathName = 'ol';
             }
                 catch(err ){continue}
            }
         }
    
      else if(choosenPath == 'OL+SHD (only)'){
       for (var count =0; count < images.length; count++){ 
      
             try{
             //images[count].clippingPath.clippingType = ClippingPathType.PHOTOSHOP_PATH;  
             images[myImageIndexList[count]].clippingPath.appliedPathName = 'ol+shd';
             
            images[myImageIndexList[count]].fit(FitOptions.FRAME_TO_CONTENT);

             }
                 catch(err ){continue}     
       }
   }
         
      else{
          //choosenPath == 'OL+SHD (make copy of image)'
       for (var count =0; count < images.length; count++){ 
             try{
                images[myImageIndexList[count]].clippingPath.appliedPathName = 'ol';
                //set x to souce image object to duplicate
                x = images[myImageIndexList[count]]
                
                // select rectangle object
                xparent = x.parent
                xparentDuplicate = xparent.duplicate();
                // sends  the duplicated rectange obj to back
                xparentDuplicate.sendToBack()
                // selects the image  [object Image]  in rectangle to set paths and transparancey
                xparentDuplicateImgObj = xparentDuplicate.images[0]
                xparentDuplicateImgObj.clippingPath.appliedPathName = 'ol+shd';
                //
                xparentDuplicate.transparencySettings.blendingSettings.blendMode = BlendMode.MULTIPLY;
                xparentDuplicate.fit(FitOptions.FRAME_TO_CONTENT);

                
    
                
                //and finally, we need to group them together
                var theItems = new Array(xparentDuplicate,  xparent);
                var theGroup = app.activeDocument.groups.add(theItems);              
                                 }
                 catch(err ){continue}          
       }
   }
}
