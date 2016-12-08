$(".answer-write input[type=submit]").click(addAnswer);

	function addAnswer(e) {
		 e.preventDefault(); //ajax로 처리하기 위하여 서버 전송을 막는다.
		 console.log("addAnswer - click...");
		 
		 var queryString = $(".answer-write").serialize();
		 var url = $(".answer-write").attr("action");
		 console.log("query = "+ queryString);
		 console.log("url = "+ url);
		 
		 //서버 전송.
		 $.ajax({
			type : 'post',
			url : url,
			data : queryString,
			dataType : 'json',
			error : onError,
			success : onSuccess
		 });
	}
	
	function onError() {
		
	}
	
	function onSuccess(data, status) { //return : Answer, status값이 넘어온다.
		console.log(data);
		var answerTemplate = $("#answerTemplate").html(); //템플릿을 읽어온다.
		//템플릿완성, 데이터를 매개인자로 전달하여 템플릿을 완성한다.(인자 순서대로 template의 번호로 매칭된다.)
		var template = answerTemplate.format(data.writer.userId, data.formattedCreateDate, data.contents, data.question.id, data.id);
		$(".qna-comment-slipp-articles").prepend(template); //만들어진 템플릿을 추가한다.
		$(".answer-write textarea").val(""); //text area초기화.
	}

	//삭제시...
//$(".link-delete-article").click(deleteAnswer); //새로 추가한 글은 동작하지 않는다, 아래처럼 구현해야 새로 등록한 글도 동작한다.
$(".qna-comment-slipp-articles").on("click", "delete-answer-form button[type='submit']", deleteAnswer)

	function deleteAnswer(e) {
		e.preventDefault();
		
		var deleteBtn = $(this);
		var url = deleteBtn.attr("href");
		console.log("url :" + url);
		
		$.ajax({
			type : 'delete',
			url : url,
			dataType : 'json',
			error : function (xhr, status) {
				console.log("error");				
			},
			success : function (data, status) {
				console.log(data);
				if (data.valid) {
					deleteBtn.closest("article").remove();
				} else {
					alert(data.errorMessage);
				}
			}
		});
	}
	
	
	//아주 작은 template engine.
	String.prototype.format = function() {
		  var args = arguments;
		  return this.replace(/{(\d+)}/g, function(match, number) {
		    return typeof args[number] != 'undefined'
		        ? args[number]
		        : match
		        ;
		  });
		};