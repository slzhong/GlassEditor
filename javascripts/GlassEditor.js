var GlassEditor = {
	init : function(){
		GlassEditor.eventHandler();
	}
	,eventHandler : function(){
		// $('.preview').editable();
		$('#editor').keyup(
			GlassEditor.applyChanges()
		);
		$('.editor-template-btn').click(
			GlassEditor.showTemplates()
		);
		$('.editor-clear-btn').click(
			GlassEditor.clearEditor()
		);
		$('.template').click(
			GlassEditor.applyTemplate()
		);
		$('.editor-add-btn').click(
			GlassEditor.addElement()
		);
	}
	,applyChanges : function(){
		return function(){
			$('#preview').html($('#editor').val());
		}
	}
	,showTemplates : function(){
		return function(){
			$('.template-container').addClass('template-container-show');
		}
	}
	,applyTemplate : function(){
		return function(){
			$('.template-container').removeClass('template-container-show');
			$('#preview').html($(this).html());
			$('#editor').val($(this).html());
		}
	}
	,clearEditor : function(){
		return function(){
			$('#editor').val('');
			$('#preview').html('');
		}
	}
	,addElement : function(){
		return function(){
			var result = '';
			var cursorMove = 0;
			var start = $('#editor')[0].selectionStart;
			var end = $('#editor')[0].selectionEnd;
			var type = $(this).attr('title');
			if(type == 'table'){
				result = '\n<table>\n<tbody></tbody>\n</table>\n';
				cursorMove = 16;
			}
			else if(type == 'img'){
				result = '\n<img src="">\n';
				cursorMove = 11;
			}
			else if(type == 'li' || type == 'tr' || type == 'td'){
				result = '<' + type +'></' + type + '>';
				cursorMove = 4;
			}
			else{
				result = '\n<' + type + '></' + type + '>\n';
				cursorMove = 3 + type.length;
			}
			if($('#editor').val() == ''){
				$('#editor').val(
					'<article>' + result + '</article>'
				);
				cursorMove += 9;
			}
			else{
				$('#editor').val(
					$('#editor').val().substr(0, start) + result + $('#editor').val().substr(end)
				);
			}
			$('#editor').focus();
			$('#editor')[0].selectionStart = $('#editor')[0].selectionEnd = start + cursorMove;
			$('#preview').html($('#editor').val());
		}
	}
}