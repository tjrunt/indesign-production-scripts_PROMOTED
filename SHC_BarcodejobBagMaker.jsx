?/*
=============================================
Author:Timothy J. Kleszczewski
Create date: 8/5/2014
Description: indesign script to  read csv file and auto populate and create job bags for sears and kmart workflows

Revision History:
=============================================
*/

main();
function main(){
    
    var FileName = File.openDialog("Please select .csv file" , "comma-delimited(*.csv):*.csv;");
        
    var myDocument = app.activeDocument;
    lastPage =  myDocument.pages.item.length ;      
    
        
    FileName.open('r') ;
    var String = FileName.read();
    FileName.close();
    
    rows = String.split('\n');
    numbRows = rows.length
    
    client = getCol(rows, 0)
    
    csvAdDate = getCol(rows, 3)
    
    SchawkJobNum = getCol(rows, 4)
    PageId = getCol(rows, 6)
    aprimoNum = getCol(rows, 1)
    PAEcol = getCol(rows, 13)
    pageNumber = getCol(rows, 11)
    pageSeq = getCol(rows, 5)
    natBase = getCol(rows, 9)
    
   // try  to get info for optional columns
    try{
        productionArtist = getCol(rows, 16)
    }
    catch(e){       
        }   
        try{
        aprimoCreativeFolder = getCol(rows, 15)  
    }
        catch(e){
}

    pageFormat = getCol(rows, 10)
    pageNum = getCol(rows, 11)
    Barcode = getCol(rows, 14)
    Barcode = formatBarcode(Barcode)
    
    //
    PageID = 'Page ID'
    Aprimo = 'Aprimo'
    PAEtext = 'PAE'
    PageSequence = 'Page Sequence' 
    AprimoCreative = 'Aprimo Creative' 
    PA = 'PA' 
    JobNum = 'Job #'  
    
    adDate = getAdDate(csvAdDate)
    clientName = setClient(client)    
    mainTextBox =joinText2( adDate, clientName)
    mainTextBox2 =joinText2(   mainTextBox, natBase)
    //pageFormat
       
    coloredTextBox =joinText2(  pageNumber, pageFormat)
  

    barcodeFont = null
    bacodeSize = null

    catagoriesText =  [ '', 'Page ID', 'Aprimo', 'PAE', 'Page Sequence' , 'Aprimo Creative', 'PA', '', 'Job #', '']    
    myColmns =  [ mainTextBox2, PageId, aprimoNum , PAEcol, pageSeq, aprimoCreativeFolder , productionArtist, coloredTextBox, SchawkJobNum, Barcode]    
    kmartStyleSheets = ['kmart_head', 'sub_head_bold', 'sub_head_bold', 'sub_head_bold' , 'sub_head_bold', 'sub_head_bold', 'sub_head_bold' , 'Tab_tab', 'sub_head_bold', 'barcode' ]
    searsStyleSheets = ['Sears_head', 'sub_head_bold', 'sub_head_bold', 'sub_head_bold' , 'sub_head_bold', 'sub_head_bold', 'sub_head_bold' , 'Tab_tab', 'sub_head_bold', 'barcode' ]

       if (client[0] === 'K'){
          styleSheet = kmartStyleSheets
          }  
        else{
          styleSheet = searsStyleSheets
            }

    //AprimoCreativeFolder = getCol(rows, 0)
    //pa = getCol(rows, 0)     
     // setting cordinates for the text frames
    // y,x y,x

    var   frame1  = new Array;
    frame1 = [.5, 1.2756, 3.4015 ,5.2156];

    var   frame2  = new Array;
    frame2 = [1.1645 , 5.4411 , 1.58  ,8.4254  ];

    var   frame3  = new Array;
    frame3 = [2.0856, 5.4411 , 2.5 ,8.4254  ];

    var   frame4  = new Array;
    frame4 = [2.9805, 5.4411 ,3.76  ,8.289 ];

    var   frame5  = new Array;
    frame5 = [1.1556 , 8.607  , 1.57 ,10.7054 ];

    var   frame6  = new Array;
    frame6 = [2.0856 , 8.607  , 2.5  ,10.7054 ];

    var   frame7  = new Array;
    frame7 = [2.9805 , 8.607  , 3.92  ,11.08  ];

    var   frame8  = new Array;
    //frame8 = [1.0404 , 11.3849, 1.7684 ,12.5099 ];
    frame8 = [ 0.5, 11.0503  , 2.44  ,12.1752 ];
    
    var   frame9  = new Array;
    frame9 = [2.9805, 11.0503 , 3.6505 ,12.8303 ];

    var   frame10  = new Array;
    frame10 = [1.96 , 12.18   , 3.6859 ,16.5591  ];
    // arrays of  the text box sizes
    var   TextBoxes  = new Array;
    TextBoxes =  [ frame1, frame2, frame3, frame4, frame5 , frame6, frame7, frame8, frame9, frame10]

    // loop to add pages and text
     for(var pageCount = 0;pageCount< client.length;pageCount++){
        z =client[pageCount]
        createPages = addPages(z, pageCount)
        // crea
        for(var i = 0;i< TextBoxes.length;i++){
            textBoxCount = i 
            pgCount = lastPage + pageCount
            addTextBox(TextBoxes[i], pgCount, myColmns[i], textBoxCount , styleSheet[i])       
            }              
        }
    
}
//
 // add  text and text boxs
 function addTextBox(makeTextBoxes, pageCount,  text,  textBoxCount, styleSheet,){
    //myFrame = app.activeDocument.pages[pageCount].textFrames.add();
    myFrame = app.activeDocument.pages[pageCount].textFrames.add();
    myFrame.geometricBounds = makeTextBoxes;

    if (catagoriesText[textBoxCount] === ''){
        myFrame.contents =  text[pageCount] ;
        
        
        myParagraphStyle = app.activeDocument.paragraphStyles.item(styleSheet);
        myFrame.parentStory.texts.item(0).applyParagraphStyle(myParagraphStyle, true);
    }
    
     else{
         try{
         myFrame.contents = text[pageCount] ;
         }
        
         catch(e){
         myFrame.contents = 'null';
         }
        finally{
        myParagraphStyle = app.activeDocument.paragraphStyles.item(styleSheet);
        myFrame.parentStory.texts.item(0).applyParagraphStyle(myParagraphStyle, true);          
         }     
     }
     }
//
// parse columns
function getCol(rows, colNum){
    var col  = new Array; 
        
        for(var i = 0;i<rows.length;i++){
            temp = rows[i].split(',');
            col.push(temp[colNum]);
                }
     return col;
}
// add pages and apply master based on client
function addPages(client, pg){         
            if (client == 'K'){                  
                  var pageTemplate = "C-Master";
                  // adds new page and apply master
                  app.activeDocument.pages.add();
                  app.activeDocument.pages.item(pg).appliedMaster = app.activeDocument.masterSpreads.item(pageTemplate); 
                }
            else if (client == 'S'){
                 var pageTemplate = "B-Master";
                 // adds new page and apply master
                app.activeDocument.pages.add();
                app.activeDocument.pages.item(pg).appliedMaster = app.activeDocument.masterSpreads.item(pageTemplate);
                }
        }
//returns the ad date from col d of the csv/xls file
function getAdDate(col){
    var  jobNumbers  = new Array;
    for(var i = 0;i<col.length;i++){
        jobAdDate = col[i].slice(8,10)
        jobAdMo = col[i].slice(5,7)
        // e.x. 1026
        jobNumber =jobAdMo + jobAdDate
        jobNumbers.push(jobNumber)   
    }
return jobNumbers;
}
//
function setClient(client){
    var  clientName  = new Array;
    for(var i = 0;i<client.length;i++){
        var x = ''
        if(client[i] == 'K'){
            x='Kmart'
            }else if (client[i] == 'S'){
                x='Sears'
                }else{
                    x  = 'Null'
                    }
            clientName.push(x)  
            }
      return clientName;
    }
// 
function formatBarcode(testArry){
    var   newArray  = new Array;
    newArray = [ ]; 
    for(var i = 0;i<testArry.length;i++){
       x = '!' + testArry[i] + '!' 
       newArray.push(x)      
    }
    return newArray
}
function joinText2(testArry1, testArry2){
    var   newArray  = new Array;
    newArray = [ ]; 
    for(var i = 0;i<testArry1.length;i++){
       x = testArry1[i] + '\n' + testArry2[i]
       newArray.push(x)
    }
    return newArray
}
