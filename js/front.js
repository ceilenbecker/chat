$(document).ready(function() {

//vars

	var roomId=0;
	var userId=0;
	
//funcs

	function getRooms(){
		$.ajax({
			url:'http://wf3.progweb.fr/chat-api/room/get/',
			dataType:'jsonp',
		}).done(function(data){
			for (room of data){
				$('#room').append('<option value='+room.id+'>'+room.roomName+'</option');
			}
		});
	}
	getRooms();


	function signup(){
		user=$('#username2').val();
		pass=$('#password2').val();
		$.ajax({
			url:'http://wf3.progweb.fr/chat-api/user/signup/',
			dataType:'json',
			method:'post',
			data:{
				username:user,
				password:pass
			}
		}).done(function(data){
			console.log(data);
		});
	}

	function signin(){
		user=$('#username').val();
		pass=$('#password').val();
		$.ajax({
			url:'http://wf3.progweb.fr/chat-api/user/signin/',
			dataType:'json',
			method:'post',
			data:{
				username:user,
				password:pass
			}
		}).done(function(data){
			userId=data.id;
			window.location.hash=window.location.hash.replace(/user\-\d+/,'')+'user-'+userId;
			$('#panel-signin').css({display:'none'})
			$('#panel-signup').css({display:'none'})
			$('#panel-room').css({display:'block'})
		});
	}
	
	function showRoom(rId,uId){
		$.ajax({
			url:'http://wf3.progweb.fr/chat-api/message/get/',
			dataType:'jsonp',
			data:{
				user:uId,
				room:rId
			}
		}).done(function(data){
			$('#chatContent tbody').html('');
			if(data.hasOwnProperty('error')){
				$('#chatContent tbody').append(data.error);
			}else{
				for (message of data){
					$('#chatContent tbody').append('<tr><td>'+message.username+'</td><td>'+message.createdAt+'</td><td>'+message.message+'</td></tr>');
				}
			}
		});
	}
	
	function addMessage(rId,uId,msg){
		$.ajax({
			url:'http://wf3.progweb.fr/chat-api/message/add/',
			dataType:'json',
			method:'post',
			data:{
				user:uId,
				room:rId,
				message:msg
			}
		}).done(function(data){
			console.log(data);
		});
	}
//hooks

	$('#room').change(function(){
		roomId=$('#room').val();
		window.location.hash=window.location.hash.replace(/&room\-\d+/,'')+'&room-'+roomId;
		showRoom(roomId,userId);
	});
	$('#submit-signup').click(function(evt){
		evt.preventDefault();
		signup();
	});
	$('#submit-signin').click(function(evt){
		evt.preventDefault();
		signin();
	});
	$('#submit-message').click(function(evt){
		evt.preventDefault();
		addMessage(roomId,userId,$('#message').val());
	});
});
