?






main();
function main(){
    filePaths = selectFiles()
    fileNames = getfileNames(filePaths)
    layerNames = getNameForLayer(fileNames)
    nums = getPageNum(fileNames)
    placeThoseBastards = myPlacePDF(filePaths,nums, layerNames)
    
    var myDocument = app.activeDocument;
    lastPage =  myDocument.pages.item.length - 1;
    myDocument.pages.item(lastPage).move(LocationOptions.AT_BEGINNING);
        
    
 
    
    }
// select pdfs
function selectFiles(){
    
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
	//Display a standard Open File dialog box.
     var myPDFFiles = new Array;    
	myPDFFiles = File.openDialog("Choose a PDF File" , any=null, bool=true);
     return myPDFFiles;
    }


// return just the name of the pdf
function getfileNames(myPDFFiles){
   var fileNames  = new Array;  
   for (var i = 0; i < myPDFFiles.length; i++) {
         
 
    temp =myPDFFiles[i];
    x = temp.toString()
    name = x.split("/").pop();    
    fileNames.push (name);

        
	}
  return fileNames;
}



// gets the page number of the pdf to place it on the proper page
function getPageNum(fileNames ){
   var pageNum  = new Array;
    
   for (var i = 0; i < fileNames.length; i++) {
  
   temp =fileNames[i];
   x = temp.toString()
   page = x.split("_", 1).pop();    
   p = parseInt(page,10);
   pageNum.push(p);
  }   
     return pageNum;
    }
    
 // place the pdf's   
 function myPlacePDF(myPDFFiles, pageNumber, fileNames){
    var myDocument = app.documents.item(0);
    // pdf place prefrences
	app.pdfPlacePreferences.pdfCrop = PDFCrop.cropMedia;
    app.pdfPlacePreferences.transparentBackground = false;
    

    // add layers by name
      for (var i = 0; i < myPDFFiles.length; i++) {
         
         var myPage = myDocument.pages.item(parseInt(pageNumber[i]) -1);
         var myLayer = myDocument.layers.add();
         myLayer.name = fileNames[i];
        
         myPDFPage = myPage.place(File(myPDFFiles[i] ));
         
         myLayer.move(LocationOptions.AT_END);
         
     }
	
}



// return just the name of the pdf
function getNameForLayer(fileNames){
   var layerNames  = new Array;  
   for (var i = 0; i < fileNames.length; i++) {
         
 
    temp =fileNames[i];
    x = temp.toString()
    name = x.slice(0, -7);    
    layerNames.push (name);

        
	}
  return layerNames;
}

