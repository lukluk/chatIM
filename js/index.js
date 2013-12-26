var lastdate='new';
var user=$.totalStorage('user');
var too=$.totalStorage('too');
var app = {
    login:function(xuser,pass){
        $('#form-signin').html('<center>Check Auth...</center>');
        $.get('http://69.46.65.96/~android/index.php/login',{user:xuser,pass:pass},function(data){

            if(data=='true'){

                user=xuser;
            $.totalStorage('login',xuser);
            $.totalStorage('user',xuser);
            window.location='contact.html';
        }else
        {
            alert('Incorect login');    
            window.location='login.html';
        }
        })        
    },
    signup:function(){
        window.location='signup.html';
    },    
    dosignup:function(user,nick,email,pass){
        $.get('http://69.46.65.96/~android/index.php/register',{user:user,email:email,nick:nick,pass:pass},function(){
            alert('Thanks for signup');
            window.location='login.html';
        })
    },    
    contact:function(){
        $.get('http://69.46.65.96/~android/index.php/getFriends/'+$.totalStorage('user'),function(xdata){
            var data=$.parseJSON(xdata);

            $('#contact').html('');
            for(var i in data){
                $('#contact').append('<button class="btn btn-lg btn-primary btn-block" onclick="app.chat('+"'"+data[i].username+"'"+')"> '+data[i].username+' </button><br/>');
            }
        });
    },
    chat:function(too){
        $.totalStorage('too',too);
        window.location='index.html';
    },
    sendMsg:function(from,to,msg){        
        $.post('http://69.46.65.96/~android/index.php/sendText/'+from+'/'+to+'',{message:msg},function(){
            
        })

    },
    update:function (){
        $.get('http://69.46.65.96/~android/index.php/getMsgs/'+user+'/'+too+'/'+lastdate,function(xdata){
            var data=$.parseJSON(xdata);
            var anew=false;
            var msg='';
            var from='';

            var data=$.parseJSON(xdata);
            
            for(var i in data){
            console.log(data[i]);
            if(typeof data[i] !='undefined')
            if(typeof data[i].xfrom !='undefined'){
                $('#content').append('<li class="'+data[i].xfrom+'"><strong>'+data[i].xfrom+'</strong><br/>'+$.base64.decode(data[i].message)+'</li>');                
                lastdate=data[i].sentdatetime;
                msg=data[i].xfrom+' : '+ $.base64.decode(data[i].message);
                from=data[i].xfrom;
                anew=true;
            }

            }
            $(".imRead").animate({ scrollTop: $('.imRead')[0].scrollHeight}, 500);
                if(anew && lastdate!='new'){
                    alert('x');
                window.plugins.localNotification.add({
                    fireDate        : Math.round(new Date().getTime()/1000 + 5),
                    alertBody       : msg,
                    action          : "View",
                    soundName       : "beep.caf",
                    badge           : 0,
                    notificationId  : 123,
                    foreground      : function(notificationId){ 
                        //alert("Hello World! This alert was triggered by notification " + notificationId); 
                    },
                    background  : function(notificationId){
                        //alert("Hello World! This alert was triggered by notification " + notificationId);
                    }           
                });            
            }
        });
        setTimeout(app.update,2000);
    },
    initialize: function() {
        if($.totalStorage('login')==null){
            window.location='login.html';
        }
        $('#content').html('');
    $(".imRead").css('height',$(window).height()-60)    ;
    $('.input').css('width',$('.imWrite').width()-$('.upload').width()-$('.send').width());
    $(".imRead").animate({ scrollTop: $('.imRead')[0].scrollHeight}, 500);
    app.update();
    $('#send').click(function(){
        var msg=$('#msg').val();
        $('#msg').val('');
        $.post('http://69.46.65.96/~android/index.php/sendText/'+user+'/'+too,{message:msg},function(){
            
        })
    });
    var url = 'http://69.46.65.96/~android/index.php/sendFile/'+user+'/'+too;
    $('#fileupload').fileupload({
        url: url,
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo('#files');
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');


    },
    // Update DOM on a Received Event
 
};
window.onerror = function(message, url, linenumber) {
  alert("JavaScript error: " + message + " on line " + linenumber + " for " + url);
}

alert(window.plugins.localNotification);