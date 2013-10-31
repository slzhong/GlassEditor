(function(){
	
	var GlassEditorNew = {
		main : function(){
			eventHandler();
		}
	}

	window.onload = GlassEditorNew.main();

	function eventHandler(){
		// $('.editor-export-btn').click(
		// 	exportCard
		// );
		$('#editor').keyup(
			applyChanges
		);
		$('.editor-template-btn').click(
			showTemplates
		);
		$('.editor-single-btn').click(
			singleMode
		);
		$('.editor-multi-btn').click(
			multiMode
		);
		$('.card-container').click(
			showCard
		);
		$('.card-delete').click(
			deleteCard
		);
		$('.card-add').click(
			addCard
		);
		$('.editor-clear-btn').click(
			clearEditor
		);
		$('.editor-add-btn').click(
			insertElement
		);
		$('.editor-add-style').click(
			insertStyle
		);
		$('.editor-class-type').click(
			showClass
		);
		$('.editor-class-item').click(
			insertClass
		);
		$('.template').click(
			applyTemplate
		);
	}

	//real-time update when edited
	function applyChanges(){
		var val = $('#editor').val();
		$('#preview').html(val);
		if($('#preview').hasClass('preview-multi')){
			$('.card-container-current').children('.card').html(val);
		}
	}

	//show templates and apply a template to preview and editor
	function showTemplates(){
		if($('.template-container').hasClass('template-container-show')){
			$('.template-container').removeClass('template-container-show');
		} else{
			$('.template-container').addClass('template-container-show');
		}
	}
	function applyTemplate(){
		$('.template-container').removeClass('template-container-show');
		$('#editor').val($(this).html());
		applyChanges();
	}

	//switch editing mode (a single card or a bundle of cards)
	function singleMode(){
		if($('#preview').hasClass('preview-multi')){
			$('#preview').removeClass('preview-multi');
			$('#preview').addClass('preview-single');
		}
	}
	function multiMode(){
		if($('#preview').hasClass('preview-single')){
			$('#preview').removeClass('preview-single');
			$('#preview').addClass('preview-multi');
			$('.card').html($('#preview').html());
		}
	}

	//handle the operation of a card (multi mode only)
	function showCard(){
		$('.card-container-current').removeClass('card-container-current');
		$(this).addClass('card-container-current');
		$('#preview').html($(this).children('.card').html());
		$('#editor').val($(this).children('.card').html());
	}
	function addCard(){
		var current = $('.card-container-current');
		var last = $('.card-container-last');
		var next = last.clone();
		var id = parseInt(last.children('.card').attr('data-cardID'));
		last.removeClass('card-container-last');
		current.removeClass('card-container-current');
		next.addClass('card-container-current');
		next.children('.card').html('').attr('data-cardID', id + 1);
		next.click(showCard);
		next.children('.card-delete').click(deleteCard);
		next.insertAfter(last);
		resizeCardContainer();
		$('#editor').val(next.children('.card').html());
		$('#preview').html(next.children('.card').html());
	}
	function deleteCard(){
		var temp = 0;
		var target = $(this).parent();
		var pos = parseInt($(this).siblings('.card').attr('data-cardID'));
		//forbid deleting the only card
		if(target.siblings().length == 1){
			return false;
		}
		//move the last pointer
		if(target.hasClass('card-container-last')){
			target.prev().addClass('card-container-last');
		}
		//move the current pointer
		if(target.hasClass('card-container-current')){
			if(target.hasClass('card-container-last')){
				target.prev().addClass('card-container-current');
			} else{
				target.next().addClass('card-container-current');
			}
		}
		//remove
		target.remove();
		//update the id of cards
		for(var i = pos; i < $('.card').length; i++){
			temp = parseInt($($('.card')[i]).attr('data-cardID'));
			$($('.card')[i]).attr('data-cardID', temp - 1);
		}
	}

	//clear all the current content
	function clearEditor(){
		$('#editor').val('');
		$('#preview').html('');
		if($('#preview').hasClass('preview-multi')){
			$('.card-container-current').children('.card').html('');
		}
	}

	//add html with one little click
	function insertElement(){
		var result = '';
		var cursorMove = 0;
		var start = $('#editor')[0].selectionStart;
		var end = $('#editor')[0].selectionEnd;
		var type = $(this).attr('title');
		if(type == 'table'){
			result = '<table class="">\n<tbody></tbody>\n</table>\n';
			cursorMove = 24;
		}
		else if(type == 'img'){
			result = '<img src="">';
			cursorMove = 10;
		}
		else if(type == 'li' || type == 'tr' || type == 'td'){
			result = '<' + type +'></' + type + '>';
			cursorMove = 4;
		} else{
			result = '<' + type + ' class=""></' + type + '>\n';
			cursorMove = 11 + type.length;
		}
		//add a article tag if editor is empty
		if($('#editor').val() == ''){
			$('#editor').val(
				'<article class="">\n' + result + '</article>'
			);
			cursorMove += 19;
		} else{
			$('#editor').val(
				$('#editor').val().substr(0, start) + result + $('#editor').val().substr(end)
			);
		}
		$('#editor').focus();
		$('#editor')[0].selectionStart = $('#editor')[0].selectionEnd = start + cursorMove;
		applyChanges();
	}
	function insertStyle(){
		$('#editor').val($('#editor').val() + '\n<style>\n\n</style>');
		$('#editor')[0].selectionStart = $('#editor')[0].selectionEnd = $('#editor').val().length - 9;
		applyChanges();
	}

	//add classnames with one little click
	function showClass(){
		if($(this).siblings('.editor-class-content').css('display') == 'block'){
			$(this).siblings('.editor-class-content').slideUp(300);
		} else{
			$(this).siblings('.editor-class-content').slideDown(300);
		}
	}
	function insertClass(){
		var result = '';
		var cursorMove = 0;
		var start = $('#editor')[0].selectionStart;
		var end = $('#editor')[0].selectionEnd;
		result = $('#editor').val().substr(0, start) + $(this).html()  + ' ' + $('#editor').val().substr(end);
		cursorMove = $(this).html().length + 1;
		$('#editor').val(result);
		$('#editor').focus();
		$('#editor')[0].selectionStart = $('#editor')[0].selectionEnd = start + cursorMove;
		$(this).parent().parent().slideUp(300);
		applyChanges();
	}

	//change the width when a card is added/deleted (multi mode only)
	function resizeCardContainer(){
		var newWidth = $('.cards-container').children().length * 180;
		$('.cards-container').css('width', newWidth + 'px');
	}

})();