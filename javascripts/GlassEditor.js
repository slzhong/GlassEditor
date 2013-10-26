var GlassEditor = {
	init : function(){
		GlassEditor.eventHandler();
	}
	,eventHandler : function(){
		// $('.preview').editable();
		$('#editor').keyup(GlassEditor.applyChanges());
		$('.editor-template-btn').click(GlassEditor.showTemplates());
		$('.template').click(GlassEditor.applyTemplate());
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
}