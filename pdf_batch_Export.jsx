?//pdf_batch_Export.jsx
// version 1.0
//An InDesign CS6 JavaScript
/*  
Dev: TimothyJ. Klleszczewski
*/
// Allows the user to select multiple indesign documents to batch create pdf's as either single page pdf's or one per document
//
//
//                    //$.writeln(myArt, "  myArt");
                    //$.writeln(myArtName, "  link is missing or out of date");
//

main();
function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned OFF.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	

    var docPaths  = new Array;
    var selectMore = new  Boolean;
    docPaths = [] 
    selectMore = false
    
    while(selectMore != true){
        myFiles = selectFiles()

        docs = appendFilePaths(myFiles , docPaths)
         
        selectMore = selectAdditionalFiles(selectMore)
        }
    
    DestFolder =getDestFolder()
    myPDFPreset = getPDFStylesUI()
    FileNames = getfileNames(docPaths)    
   
    finalPdfFDestPath = getDestPath(FileNames, DestFolder)

    for (i = 0; i <docPaths.length; i++) {
        
        openFiles(docPaths[i])
        missingFonts = getMissingFonts()
        myBadImages = getUnlinkedImages()
        
        $.writeln(myBadImages)
        
        loggy = writeLogFile(missingFonts, myBadImages, finalPdfFDestPath[i])
        saveAsPdfFiles( myPDFPreset, finalPdfFDestPath[i])
        app.documents.item(0).close(SaveOptions.no);               
    } 

    doneProcessing()
    

}


function getUnlinkedImages(){
   var badImages  = new Array;

    var myDoc = app.activeDocument;
    var myDocPath = myDoc.filePath;
    var indesignPages = myDoc.pages.length;
    var rect = app.activeDocument.rectangles;  

     for (var count =0; count < rect.length; count++){ 
         try{
        var myArt = rect[count].graphics[0]; 
        var myArtName = myArt.itemLink.name;
        
            if (myArt.itemLink.status == LinkStatus.LINK_MISSING || myArt.itemLink.status == LinkStatus.LINK_OUT_OF_DATE){  
                 x = String(myArtName + "  link is missing or out of date")
                 badImages.push(x);
                    }
            else {             
                }   
            }
        catch (e) {}
           }
       return badImages
}
function saveAsPdfFiles(myPDFPreset,  destPath){
    var myDocument = app.activeDocument;
    var myPages = myDocument.pages;
     
     // saves all pages in one pdf
     if(myPDFPreset.pageRange != true ){
        var fileName = File(destPath + '.pdf');
        app.pdfExportPreferences.pageRange = PageRange.allPages;
        myDocument.exportFile(ExportFormat.pdfType,   fileName , false, myPDFPreset.preset );
        }
    else{
           // saves pdf 's  as single pages 
          for (myPage = 0; myPage < myPages.length; myPage++) {
          
          var fileName = File(destPath + "_" + myPage + '.pdf' );
        app.pdfExportPreferences.pageRange = myDocument.pages[myPage].name;
        myDocument.exportFile(ExportFormat.pdfType,   fileName , false, myPDFPreset.preset);
               
        }
     
  }
    
    }
function openFiles(filePath){
         
                try{
        app.open(filePath);
        }
    
    catch(err) {
        // close file and write error log
        }
    
    }

//select dest folder
function getDestFolder(){
        destinationFolder = Folder.selectDialog( "Select a folder to save files to" );
        return destinationFolder
    }
//returns full dest Path  by combining the path and file name
function getDestPath(fileName, destFolder){
       var destinationPath  = new Array;  
        for (var i = 0; i < fileName.length; i++) {
            x = destFolder + "/" + fileName[i];
            destinationPath.push (x);
    }
    return destinationPath
}

// return  the name of the file path without .indd
function getfileNames(filePaths){
   var fileNames  = new Array;  
   for (var i = 0; i < filePaths.length; i++) {
    temp =filePaths[i];
    x = temp.toString()
    name = x.split("/").pop();  
    name = name.replace (/\.ind[bd]$/, '')  
    fileNames.push (name);
	}
  return fileNames;
}


// UI to show the pdf presets and select weather to save the pdf's as single pages
function getPDFStylesUI(){
    //  names
    var app_presets = app.pdfExportPresets.everyItem().name;    
    var w = new Window ("dialog", "Select PDF preset", undefined, {closeButton: false});
    w.alignChildren = "right";
    var main = w.add ("group");
    main.add ("statictext", undefined, "Folder: ");
    var group = main.add ("group {alignChildren: 'left', orientation: 'stack'}");
    if (File.fs != "Windows"){
    var list = group.add ("dropdownlist", [0,0,240,20], app_presets);
    list.minimumSize.width = 220;
    var e = group.add ("edittext", [0,0,220,20]);
    e.text = app_presets[0]; e.active = true;
    }else{
    var e = group.add ("edittext", [0,0,220,20]);
    e.text = app_presets[0]; e.active = true;
    var list = group.add ("dropdownlist", [0,0,240,20], app_presets);
    list.minimumSize.width = 220;
    }

   var check1 = w.add ("checkbox", undefined, "Save as single Pages");
    check1.value = true;
    w.alignChildren = "left";

    var buttons = w.add ("group")
    buttons.add ("button", undefined, "OK", {name: "ok"});
    buttons.add ("button", undefined, "Cancel", {name: "cancel"});
    list.onChange = function () {e.text = list.selection.text; e.active = true}
     //w.alignChildren = "left";
 
    w.show ();
    return { pageRange: check1.value  ,  preset: e.text
        }
}
// tells user the proessing is done
function doneProcessing(){
    var myWindow = new Window ("dialog", " Your files are:");
    myWindow.orientation = "row";
    
    myWindow.add ("button", undefined, "DONE", {name: "ok"});
    myWindow.graphics.font = "dialog:24";
     myWindow.show ()
     app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
}
// dialog to select files in new folder 
function selectAdditionalFiles(selectMore){
    var myWindow = new Window ("dialog", " It's a wonderful day, let's batch some files");
    myWindow.orientation = "row";
    myWindow.add ("statictext", undefined, "click add to select additional .indd files from another folder?");
    myWindow.add("button", undefined, "Add", {name: "ok"});
    myWindow.add ("button", undefined, "Done", {name: "cancel"});

        if (myWindow.show () == 1){
        selectMore = false
        // todo open file select dialog and add more files
        }
        else
        {
        selectMore = true
        return selectMore
        }


}


// returns an appended arry of paths to the docs
function appendFilePaths(newDocPaths, oldPaths){
   for (var i = 0; i < newDocPaths.length; i++) {
        oldPaths.push (newDocPaths[i]);
	}
  return oldPaths;
}
// select files home boy
function selectFiles(){ 
     var myDocs = new Array;
	myDocs = File.openDialog("Choose inDesign Files's  to PDF (hold down shift to select multiple files)" , any=null, bool=true);
    return myDocs
    }
function getMissingFonts(){
   var missingFonts  = new Array;
   var usedFonts = app.activeDocument.fonts;
     
    for(var i = 0; i < usedFonts.length; i++){
        if(usedFonts[i].status != FontStatus.INSTALLED){
                //$.writeln('usedFonts',  findCharacters(usedFonts[i].name))
                  x = String(usedFonts[i].postscriptName)
                   missingFonts.push(x);
        }
    }
    return missingFonts
}

function writeLogFile(missingFonts, missingImages, logFileName){
   var fileName = File(logFileName + "_log.txt");    
     if (missingFonts.length > 0 || missingImages.length > 0){
     fileName.open('w') ;  
     // loop to write missing fonts to log
        for(var i = 0; i < missingFonts.length; i++){
            fileName.writeln('')
            fileName.writeln('File ' +  logFileName + ' is missing the following font: ')
            fileName.writeln(missingFonts[i])
            fileName.writeln('')
        }
         // loop to write missing or out of date images to log
        for(var j = 0; j < missingImages.length; j++){
            fileName.writeln('')
            fileName.writeln(missingImages[j])
            fileName.writeln('')
        }

    }

     fileName.close();
}





