(function ($, $S) {
    //$ jQuery
    //$S window.localStorage
    //Variables Declaration
    var $board = $('#board'),
        //Board where the Posticks (Sticky note) are sticked
        Postick, //Singleton Object containing the Functions to work with the LocalStorage
        len = 0,
        //Length of Objects in the LocalStorage 
        currentNotes = '',
        //Storage the html construction of the posticks (Sticky note)
        dataFromLocalStorage, //Actual Postick (Sticky note) data in the localStorage
        myTop = 100, //default positon - to not display every postick (Sticky note) one over another
        myLeft= 30;
   
   
   
    //Manage the Posticks (Sticky note) in the Local Storage
	//Each postick (Sticky note) is saved in the localStorage as an Object  
    Postick = {
        add: function (obj) { //function for object
            obj.id = $S.length; //for this object we create a proparty id=of current lenght of localStorage
            $S.setItem(obj.id, JSON.stringify(obj)); // in lokalStoridj create an element
        },            //name,   value of  element

        retrive: function (id) {
            return JSON.parse($S.getItem(id));
        },

        remove: function (id) {
            $S.removeItem(id);
        },

        removeAll: function () {
            $S.clear();
        }

    };

    //when open the browser or refresh it- display the exist Posticky (Sticky note)
    len = $S.length;
    if (len) {
        for (var i = 0; i < len; i++) {
            //Create all posticks (Sticky note) saved in localStorage
            var key = $S.key(i);
            
            dataFromLocalStorage= Postick.retrive(key); // all property of current Postick (Sticky note) like a object- top, left, text, id;
            

            currentNotes += '<div class="postick '+dataFromLocalStorage.rotation+' '+dataFromLocalStorage.statusNote+'" ';
            currentNotes += ' style="left:' + (dataFromLocalStorage.left+14);
            currentNotes += 'px; top:' + (dataFromLocalStorage.top+14);
			//data-key is the attribute to know what item delete in the localStorage
            currentNotes += 'px"><div class="toolbar"><span class="delete" data-key="' + key;
            currentNotes += '"><img src="img/cancel.png" alt="cancel img"/></span><div class="infoButton"><img src="img/info.png" alt="info img"/></div></div><div contenteditable="true" class="editable title">'+dataFromLocalStorage.title+'</div>';
            currentNotes += '<div contenteditable="true" class="editable infoText">';
            currentNotes += dataFromLocalStorage.text;
            currentNotes += '</div>';
            currentNotes += '<div class="settings"><div class="settingsInner">';
            currentNotes +=  '<p>Choose status:</p>';
            currentNotes +=  '<form id="postickStatus" name="postickStatus">';

            // to visual saved checked radio button
            if(dataFromLocalStorage.statusNote == 'red'){
                currentNotes += '<input type="radio" name="status'+key+'" value="red" id="red'+key+'" checked="checked"><label for="red'+key+'">To Do</label><br />';                
            }
            else{
                currentNotes +=  ' <input type="radio" name="status'+key+'" value="red" id="red'+key+'"><label for="red'+key+'">To Do</label><br />';
            }

            if(dataFromLocalStorage.statusNote == 'yellow'){
                currentNotes += ' <input type="radio" name="status'+key+'" value="yellow" id="yellow'+key+'"  checked="checked"><label for="yellow'+key+'">In progress</label><br />';                
            }
            else{
                currentNotes +=  ' <input type="radio" name="status'+key+'" value="yellow" id="yellow'+key+'"><label for="yellow'+key+'">In progress</label><br />'; 
            }

            if(dataFromLocalStorage.statusNote == 'green'){
                currentNotes +=' <input type="radio" name="status'+key+'" value="green" id="green'+key+'" checked="checked"><label for="green'+key+'">Done</label>';                
            }
            else{
                currentNotes +=  ' <input type="radio" name="status'+key+'" value="green" id="green'+key+'"><label for="green'+key+'">Done</label>';
            }

            currentNotes +=  '</form></div>';
            currentNotes +=  '</div>';
            currentNotes += '</div>';     
        }

        //Append all the posticks (Sticky note) to the board
        $("#board").html(currentNotes);
      
    }

    //When the document is ready, make all posticks (Sticky note) Draggable
    $(document).ready(function () {
        $(".postick").draggable({
            cancel: '.editable',
			"zIndex": 5000, //current Postick (Sticky note) be always on top
			"stack" : '.postick'
        });

        //info func
         var settings = '';
         var newStatus = '';
         $($board).on('click', '.infoButton',  function(){
            settings = $(this).parent().parent().find('.settings');
            $(settings).slideToggle("slow");
         });


    });

    //Remove Postick (Sticky note)
    $($board).on('click', '.delete', function () {
        
        var $this = $(this);
		//data-key is the attribute to know what item delete in the localStorage
        Postick.remove($this.attr('data-key'));
        $this.closest('.postick').fadeOut('slow', function () {
            $(this).remove();
        });
    });

            //for change a status
        $($board).on('change', 'input[type="radio"]', function () {
           newStatus = $(this).val();
           settings = $(this).parent().parent().parent().parent().find('.settings');
           $(settings).slideUp("slow");  
           $(this).parent().parent().parent().parent().removeClass('red yellow green').addClass(newStatus);
         });

    //Create postick (Sticky note) whit a button
    $('#btn-addNote').click(function () {
        myTop += 40;
        myLeft += 30;
        if(myTop>300){
            myTop=100;
            myLeft=20;
        }
        var notesCount=($('.postick').length)%2;
        var rotateStatus="";
        var key =$('.postick').length;
        rotateStatus = (notesCount == 1) ? "left":"right";
        

        var newPostick = '<div class="postick '+rotateStatus+'" style="left:'+myLeft+'px;top:'+myTop+'px"><div class="toolbar"><span class="delete" title="Close"><img src="img/cancel.png" alt="cancel img"/></span><div class="infoButton"><img src="img/info.png" alt="info img"/></div></div><div contenteditable class="editable title"></div><div contenteditable class="editable infoText"></div>';
            newPostick += '<div class="settings"><div class="settingsInner">';
            newPostick +=  '<p>Choose status:</p>';
            newPostick +=  '<form id="postickStatus" name="postickStatus">';
            newPostick +=  ' <input type="radio" name="status'+key+'" value="red" id="red'+key+'"><label for="red'+key+'">To Do</label><br />';
            newPostick +=  ' <input type="radio" name="status'+key+'" value="yellow" id="yellow'+key+'"><label for="yellow'+key+'">In progress</label><br />';
            newPostick +=  ' <input type="radio" name="status'+key+'" value="green" id="green'+key+'"><label for="green'+key+'">Done</label>';
            newPostick +=  '</form></div>';
            newPostick +=  '</div>';
            newPostick += '</div>';

        $(newPostick).hide().appendTo($board).fadeIn('slow');


        //$board.append().fadeIn('slow');
        $(".postick").draggable({
            cancel: '.editable',
            "zIndex": 5000,
            "stack" : '.postick'
        });
    });

    //Save all the posticks (Sticky note) when the user leaves the page
    window.onbeforeunload = function () {
        //Clean the localStorage
        Postick.removeAll();
        //Then insert each postick (Sticky note) into the LocalStorage
		//Saving their position (Sticky note) on the page, in order to position them when the page is loaded again
        $('.postick').each(function () {
            var $this = $(this);
            var classes = $(this).attr('class');
            var classRotateArr = classes.split(' '); //array whit all classes
            var classRorate = ""; //for save a value of rotation
            var classStatus = ""; // for save a value of status

            //loop for find a position of rotate and status of postick, for each postick (Sticky note)
            for (var i = 0; i < classRotateArr.length; i++) {
                if ((classRotateArr[i]=="red") || (classRotateArr[i]=="yellow") || (classRotateArr[i]=="green") ){
                    classStatus=classRotateArr[i];
                }
                if ((classRotateArr[i]=="right") || (classRotateArr[i]=="left")){
                    classRorate=classRotateArr[i];
                } 
            };
            //saving of all current values of exist postick (Sticky note)
            Postick.add({
                top: parseInt($this.position().top),
                left: parseInt($this.position().left),
                title: $this.children('.editable.title').text(),
                text: $this.children('.editable.infoText').text(),
                rotation: classRorate,
                statusNote: classStatus
            });
        });
    }
})(jQuery, window.localStorage);