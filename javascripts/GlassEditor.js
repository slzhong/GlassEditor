var GlassEditor = {
	init : function(){
		GlassEditor.styleHandler();
		GlassEditor.eventHandler();
	}
	,styleHandler : function(){
		GlassEditor.resizeCardContainer();
	}
	,eventHandler : function(){
		// $('.preview').editable();
		$('#editor').keyup(
			GlassEditor.applyChanges()
		);
		$('#preview').click(
			GlassEditor.editInPlace()
		);
		$('.editor-template-btn').click(
			GlassEditor.showTemplates()
		);
		$('.editor-single-btn').click(
			GlassEditor.singleMode()
		);
		$('.editor-multi-btn').click(
			GlassEditor.multiMode()
		);
		$('.card-container').click(
			GlassEditor.showCard()
		);
		$('.card-delete').click(
			GlassEditor.deleteCard()
		);
		$('.card-add').click(
			GlassEditor.addCard()
		);
		$('.editor-clear-btn').click(
			GlassEditor.clearEditor()
		);
		$('.editor-export-btn').click(
			GlassEditor.exportCard()
		);
		$('.editor-add-btn').click(
			GlassEditor.insertElement()
		);
		$('.editor-class-type').click(
			GlassEditor.showClasses()
		);
		$('.editor-class-item').click(
			GlassEditor.insertClass()
		);
		$('.editor-add-style').click(
			GlassEditor.addStyleTag()
		);
		$('.template').click(
			GlassEditor.applyTemplate()
		);
	}
	,resizeCardContainer : function(){
		$('.cards-container').css('width', $('.cards-container').children().length * 180 + 'px');
	}
	,applyChanges : function(){
		return function(){
			$('#preview').html($('#editor').val());
			if($('#preview').hasClass('preview-multi')){
				$('.card-container-current').children('.card').html($('#editor').val());
			}
		}
	}
	,showTemplates : function(){
		return function(){
			if($('.template-container').hasClass('template-container-show')){
				$('.template-container').removeClass('template-container-show');
			}
			else{
				$('.template-container').addClass('template-container-show');
			}
		}
	}
	,applyTemplate : function(){
		return function(){
			$('.template-container').removeClass('template-container-show');
			$('#editor').val($(this).html());
			(GlassEditor.applyChanges())();
		}
	}
	,singleMode : function(){
		return function(){
			if($('#preview').hasClass('preview-multi')){
				$('#preview').removeClass('preview-multi');
				$('#preview').addClass('preview-single');
			}
		}
	}
	,multiMode : function(){
		return function(){
			if($('#preview').hasClass('preview-single')){
				$('#preview').removeClass('preview-single');
				$('#preview').addClass('preview-multi');
				$('.card').html($('#preview').html());
			}
		}
	}
	,showCard : function(){
		return function(){
			$('.card-container-current').removeClass('card-container-current');
			$(this).addClass('card-container-current');
			$('#preview').html($(this).children('.card').html());
			$('#editor').val($(this).children('.card').html());
		}
	}
	,addCard : function(){
		return function(){
			var temp = $('.card-container-last');
			var next = temp.clone();
			var id = parseInt(temp.children('.card').attr('data-cardID'));
			$('.card-container-current').removeClass('card-container-current');
			temp.removeClass('card-container-last');
			next.addClass('card-container-current');
			next.insertAfter(temp);
			next.children('.card').html('').attr('data-cardID', id + 1);
			next.click(GlassEditor.showCard());
			next.children('.card-delete').click(GlassEditor.deleteCard());
			GlassEditor.resizeCardContainer();
			$('#editor').val(next.children('.card').html());
			$('#preview').html(next.children('.card').html());
		}
	}
	,deleteCard : function(){
		return function(){
			var temp = 0;
			var target = $(this).parent();
			var pos = parseInt($(this).siblings('.card').attr('data-cardID'));
			if(target.siblings().length == 1){
				return false;
			}
			if(target.hasClass('card-container-last')){
				target.prev().addClass('card-container-last');
			}
			if(target.hasClass('card-container-current')){
				if(target.hasClass('card-container-last')){
					target.prev().addClass('card-container-current');
				}
				else{
					target.next().addClass('card-container-current');
				}
			}
			target.remove();
			for(var i = pos; i < $('.card').length; i++){
				temp = parseInt($($('.card')[i]).attr('data-cardID'));
				$($('.card')[i]).attr('data-cardID', temp - 1);
			}
		}
	}
	,clearEditor : function(){
		return function(){
			$('#editor').val('');
			$('#preview').html('');
			if($('#preview').hasClass('preview-multi')){
				$('.card-container-current').children('.card').html('');
			}
		}
	}
	,insertElement : function(){
		return function(){
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
			}
			else{
				result = '<' + type + ' class=""></' + type + '>\n';
				cursorMove = 11 + type.length;
			}
			if($('#editor').val() == ''){
				$('#editor').val(
					'<article class="">\n' + result + '</article>'
				);
				cursorMove += 19;
			}
			else{
				$('#editor').val(
					$('#editor').val().substr(0, start) + result + $('#editor').val().substr(end)
				);
			}
			$('#editor').focus();
			$('#editor')[0].selectionStart = $('#editor')[0].selectionEnd = start + cursorMove;
			(GlassEditor.applyChanges())();
		}
	}
	,addStyleTag : function(){
		return function(){
			$('#editor').val($('#editor').val() + '\n<style>\n\n</style>');
			$('#editor')[0].selectionStart = $('#editor')[0].selectionEnd = $('#editor').val().length - 9;
			(GlassEditor.applyChanges())();
		}
	}
	,editInPlace : function(){
		return function(){
			
		}
	}
	,showClasses : function(){
		return function(){
			if($(this).siblings('.editor-class-content').css('display') == 'block'){
				$(this).siblings('.editor-class-content').slideUp(300);
			}
			else{
				$(this).siblings('.editor-class-content').slideDown(300);
			}
		}
	}
	,insertClass : function(){
		return function(){
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
			(GlassEditor.applyChanges())();
		}
	}
	,exportCard : function(){
		return function(){
			
		}
	}
}