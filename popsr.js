/*
 * written by aakpinar
 * v1.69
 */
function loadingPopsr(id,value) {
	if (!$('.popsr.'+id).length) { var _loadingPopsr = new popsr(popsrLoadingText('<input type="hidden" id="popsrClose" value="2" />İşlemleriniz tamamlanırken lütfen bekleyin.'), {setName:id, modal: true, closeButton: false}); $('#loadingText',_loadingPopsr).html(value); }
	else { $('.popsr.'+id+' #loadingText').html(value); }
}
function popsr_close(){ if ($('.popsr').length) $('.popsr').remove(); if ($('.popsr-modal').length) $('.popsr-modal').remove(); history.pushState("", document.title, window.location.pathname+window.location.search); }
function popsrLoadingText(text) { return "<div align=\"center\" style=\"min-width:150px; width:100%; text-align:center;\"><b>"+text+"</b><br /><div class='loading2' <div id=\"loadingText\"></div></div>"; }

var popsrCount=0;
function popsr(data, options) {
	if ($('#popsr'+popsrCount).length) popsrCount++;
	var _this = this;
	_this.options = $.extend({}, popsr.prototype.options, options || {});
	_this.popsr = $(_this.template());
	if (data=="loading") data=popsrLoadingText("Loading...");
	_this.setContent(data);

	_this.options.transparent = _this.options.transparent == null || _this.options.transparent == '' || !_this.options.transparent ? "" : " tbg";

	if(_this.options.title == null) {
		$('.popsr-titlebox', _this.popsr).remove();
	} else {
		if(_this.options.titleLink == null) { $('.popsr-title', _this.popsr).append(_this.options.title); } else { $('.popsr-title', _this.popsr).append('<a href="'+_this.options.titleLink+'">'+_this.options.title+'</a>'); }
		if((_this.options.buttons.length === 0 && !_this.options.autoclose) || _this.options.closeButton) {
			if(_this.options.closeButton) {
				var close = $('<span class="popsr-closebtn"></span>');
				close.bind('click', function() {
					_this.hide();
				});

				$('.popsr-titlebox', this.popsr).prepend(close);
			}
		}
		if(_this.options.titleClass != null) $('.popsr-titlebox', this.popsr).addClass(_this.options.titleClass); else $('.popsr-titlebox', this.popsr).addClass('anim');
		if(_this.options.myposition != null) { var myposition=_this.options.myposition; } else { var myposition="fixed"; }

	}
	if(_this.options.width != null) $('.popsr-box', _this.popsr).css('max-width', _this.options.width);

	if(_this.options.buttons.length > 0) {
		for (var i = 0; i < _this.options.buttons.length; i++) {
			var cls = (_this.options.buttons[i]["class"]) ? _this.options.buttons[i]["class"] : '';
			var btn = $('<div class="btnbox"><button id="" class="button00 ' + cls + '" href="#">' + _this.options.buttons[i].label + '</button></div>').data('value', _this.options.buttons[i].val);
			btn.bind("click",function(){var e=$.data(this,"value");
				var t=_this.options.callback!=null?function(){_this.options.callback(e)}:null;_this.hide(t)});
			$('.popsr-actions', this.popsr).append(btn);
		}
	} else {
		$('.popsr-footbox', this.popsr).remove();
	}
	if(_this.options.buttons.length === 0 && _this.options.title == null && !_this.options.autoclose) {
		if(_this.options.closeButton) {
			var close = $('<span class="popsr-closebtn"></span>');
			close.bind('click', function() { _this.hide(); });
			$('.popsr-content', this.popsr).prepend(close);
		}
	}
	_this.modal = (_this.options.modal) ?
		$('<div id="popsr-modal'+popsrCount+'" class="popsr-modal"></div>').css({opacity: _this.options.modalOpacity, width: '100%', height: '100%', 'z-index': _this.options.zIndex + $('.popsr').length}).appendTo(document.body) :
		null;

	if(_this.options.show) { _this.show(); $('.btnbox button').focus(); }

	function popsrFormCheck() {
		if ($(".popsr-content #popsrClose").length && $(".popsr-content #popsrClose").val()=='3') { return false; }
		if ($(".popsr-content #popsrClose").length && $(".popsr-content #popsrClose").val()=='2') { return true; }
		else {
			if (($('.popsr-content textarea').length && $('.popsr-content textarea').val().length>5) || $(".popsr-content #popsrClose").val()=='1') {
				if (!$('.popsr.lostinfo').length) { new popsr('Formu tamamlamadınız, işleminizi iptal etmek istediğinize emin misiniz?', { padding:'10px', titleClass:'anim', title:'Eksik Bilgi', setName:'lostinfo', closeButton:true, buttons: [{id: 0, label: 'Evet', val: '1'}, {id: 1, label: 'Hayır', val: '0'}], modal:true, callback: function(val){ if(val==1){ _this.hide(); } }	}); }
				return true;
			}
			else {
				return false;
			}
		}
	}

	$(document).keyup(function(e){ if(e.keyCode === 27) { if (popsrFormCheck()==false) _this.hide(); } });
	$(_this.modal).bind('click', function(e) { if (popsrFormCheck()==false) _this.hide(); });
	$(window).on("resize",function(e){_this.resize();});
	$(_this.popsr).bind("contentchange", function(e) { _this.resize(); _this.resize(); });
	if (_this.options.autoclose != null) {
		setTimeout(function (_this) {
			_this.hide();
		}, _this.options.autoclose, this);
	}
	return _this;
}
popsr.prototype = {
	options: { transparent:false, timeout:15000, setName: '', autoclose: null, buttons: [], callback: null, closeback: null, center: true, closeButton: true, height: 'auto', title: null, titleClass: null, modal: true, modalOpacity: .6, padding:'0', paddingTop: '0', paddingBottom: '0', paddingLeft: '0', paddingRight: '0', dontClose: false, show: true, viewport: {top: '0px', left: '0px'}, width: 'auto', zIndex: 9998, maxHeight:650 },
	template: function() { return '<div class="popsr '+this.options.transparent+' '+this.options.setName+'" id="popsr'+popsrCount+'"><div class="popsr-box '+this.options.transparent+'"><div class="popsr-wrapper '+this.options.transparent+'"><div class="popsr-titlebox noselect"><div class="popsr-title"></div></div><div class="popsr-content"></div><div class="popsr-footbox"><div class="popsr-actions"></div></div></div></div></div>' },
	content: '<div></div>',
	visible: false,
	setContent: function(data) {
		if (jQuery.type(data)!=="object"){
			if (typeof data !== "undefined") {
				if (data.length && data.replace(/(<([^>]+)>)/ig,"").length<75) data="<div class=\"popsr-inform\">"+data+"</div>";
			} else {
				data="<div class=\"popsr-inform\">Error</div>";
			}
		}

		$('.popsr-content', this.popsr)
			.css({'padding-bottom': this.options.paddingBottom, 'padding-top': this.options.paddingTop, 'padding-left': this.options.paddingLeft, 'padding-right': this.options.paddingRight, 'height': this.options.height})
			.empty()
			.append(data)
			.trigger("contentchange");
		if (this.options.padding!='0') $('.popsr-content', this.popsr).css({'padding': this.options.padding});
	},
	viewport: function() {
		if (typeof myposition =='undefined' || myposition=="fixed") {
			vartop=(($(window).height() - this.popsr.height()) / 2) + "px";
		}
		else {
			vartop=(($(window).height() - this.popsr.height()) / 2) +	$(window).scrollTop() + "px";
		}
		//console.debug(this.popsr.width());
		return {
			top: vartop,
			left: (($(window).width() - this.popsr.width()) / 2) + $(window).scrollLeft() + "px"
		};
	},
	show: function() {
		if(this.visible) return;
		if(this.options.modal && this.modal != null) this.modal.show();
		this.popsr.appendTo(document.body);
		if(this.options.center) this.options.viewport = this.viewport($('.popsr-box', this.popsr));

		//console.debug(this.options.viewport);
		if (this.options.viewport.left.replace('px','')<0) {
			this.popsr.css({top: this.options.viewport.top, left: '5%', maxWidth: '90%'});
		} else {
			this.popsr.css({top: this.options.viewport.top, 'z-index': this.options.zIndex + $('.popsr').length}).show().css({opacity: 1});
			this.popsr.css({left: this.options.viewport.left,});
		}

		this.popsr.css({'z-index': this.options.zIndex + $('.popsr').length}).show().css({opacity: 1});

		this.visible = true;
	},

	hide: function(after) {
		if (!this.visible) return;
		var _this = this;
		this.popsr.animate({top:'-'+this.popsr.height()+'px', width:'50px', height:'50px'}, 300, function() {
			_this.popsr.remove();
			if (after) after.call();
			$(window).unbind('resize', function () { _this.resize(); });
			if (!$('.popsr').length) history.pushState("", document.title, window.location.pathname+window.location.search);
		});
		if(_this.options.modal && _this.modal != null) $(_this.modal).fadeOut('slow', function(){$(this).remove();});
		if(_this.options.closeback!=null) _this.options.closeback();
		return this;
	},

	resize: function() {
		var _this = this;
		if(this.options.modal && this.modal != null)
			$('.popsr-modal', this.modal).css({width: '100%', height: '100%'});
		if(this.options.center) {
			var objpopsr_content=$('.popsr-content', this.popsr);
			var oldHeight=$('.popsr-content', this.popsr).height();
			$('.popsr-content', this.popsr).css('height', 'auto');
			var decraseLimit=0;
			if(this.options.buttons.length > 0) { decraseLimit=decraseLimit-$('.popsr-footbox', this.popsr).height(); }
			if(this.options.title != null) { decraseLimit=decraseLimit-$('.popsr-titlebox', this.popsr).height(); }
			var newHeight=$(window).height()+decraseLimit-($(window).height()*20/100);

			$('.popsr-content', this.popsr).css({ height: $('.popsr-content', this.popsr).height()+'px' });

			if (this.popsr.height()>$(window).height()) {
				$('.popsr-content', this.popsr).css({ height: newHeight+'px' });
			}
			else { $('.popsr-content', this.popsr).css({ height: $('.popsr-content', this.popsr).height()+'px' }); }

			this.options.viewport = this.viewport($('.popsr-box', this.popsr));
			//console.debug(this.options.viewport);
			if (this.options.viewport.left.replace('px','')<0) {
				this.popsr.css({top: this.options.viewport.top, left: '5%', maxWidth: '90%'});
			} else {
				this.popsr.css({top: this.options.viewport.top, left: this.options.viewport.left});
			}

		}
		if (!_this.options.dontClose && ($('.popsr-content #alert', this.popsr).length || ($('.popsr-content', this.popsr).html().length<75 && _this.options.buttons.length < 1))) { setTimeout(function(){_this.hide();},3000); }
	},

	toggle: function() { this[this.visible ? 'hide' : 'show'](); return this; },
};

$.extend(popsr, {
	alert: function(data, callback, options) {
		var buttons = [{id: 'ok', label: 'OK', val: 'OK'}];
		options = $.extend({closeButton: false, buttons: buttons, callback:function() {}}, options || {}, {show: true, closeback: callback});
		return new popsr(data, options);
	},
	ask: function(data, callback, options) {
		var buttons = [
			{id: 'yes', label: 'Yes', val: 'Y', "class": 'btn-success'},
			{id: 'no', label: 'No', val: 'N', "class": 'btn-danger'},
		];
		options = $.extend({closeButton: false, modal: true, buttons: buttons, callback:function() {}}, options || {}, {show: true, callback: callback});
		return new popsr(data, options);
	},
	img: function(src, options) {
		var img = $(new Image()).attr('src', ''+src);
		$(img).load(function() {
			var vp = {width: $(window).width() - 50, height: $(window).height() - 50};
			var ratio = (this.width > vp.width || this.height > vp.height) ? Math.min(vp.width / this.width, vp.height / this.height) : 1;
			$(img).css({width: this.width * ratio, height: this.height * ratio});
			options = $.extend(options || {}, {show: true, closeButton: true, width: this.width * ratio, height: this.height * ratio, padding: 0});
			new popsr(img, options);
		}).error(function() { console.log('Error loading ' + src); }).attr('src', src);
	},

	img2: function(src, options) {
		var img = "<img class='popsrimg2' src='"+src+"' style='max-height:300px; max-width:auto;' border='0' />";
		console.debug(src);
		var vp = {width: $(window).width() - 50, height: $(window).height() - 50};
		var ratio = (this.width > vp.width || this.height > vp.height) ? Math.min(vp.width / this.width, vp.height / this.height) : 1;
		$(img).css({width: this.width * ratio, height: this.height * ratio});
		options = $.extend(options || {}, {show: true, transparent:' tbg', closeButton: true, width: this.width * ratio, height: this.height * ratio, padding: 0});
		new popsr(img, options);
		window.setTimeout(function(){ popsr_center($('.popsrimg2')); }, 100)
	},


	json: function(url, options) {
		options = $.extend(options || {}, {show: true, params: {}});
		var loadObject = new popsr('loading', options);

		return $.ajax({
			type: "POST",
			data: options.data,
			url: url,
			async: false,
			dataType: 'json',
			timeout: options.timeout,
			cache: false,
			error: function (request, status, error) {
				console.debug(request.responseText);
				console.debug(error);
				popsr_close();
				new popsr('Connection error. Please try again later.', {autoclose:2000});
			},
			success: function(json) {
				if (typeof json.redirect !== "undefined") {
					location.href=URL+json.redirect;
					popsr_close();
				} else {
					//console.debug(json);
					if (typeof json.content === "undefined" || json.content.length==0) {
						loadObject.hide();
					} else {
						if ($('.popsr-content').length) {
							loadObject.setContent(json.content);
						} else {
							loadObject = new popsr(json.content, options);
						}
						if ($('.popsr-content img').length) {
							var loaded = 0;
							$('.popsr-content img').load(function() {
								loaded++;
								if (loaded == $('.popsr-content img').length) { loadObject.resize(); }
							});
						}
					}
				}
			}
		});
	},



	load: function(url, options) {
		options = $.extend(options || {}, {show: true, params: {}});
		var loadObject = new popsr('loading', options);
		$.ajax({
			type: "POST",
			data: options.data,
			url: url,
			timeout: options.timeout,
			cache: false,
			error: function (request, status, error) {
				console.debug(request.responseText);
				console.debug(error);
				popsr_close();
				new popsr('Connection error, please try again.', {autoclose:2000});
			},
			success: function(html) {
				if ($('.popsr-content').length) {
					loadObject.setContent(html);
				} else {
					loadObject = new popsr(html, options);
				}

				if (html.length==0) { loadObject.hide(); }
				else {

					if ($('.popsr-content img').length) {
						var loaded = 0;
						$('.popsr-content img').load(function() { loaded++; if (loaded == $('.popsr-content img').length) { loadObject.resize(); } });
					}
				}
			}
		});
	},

	update: function(object, options) {
		options = $.extend(options || {}, {show: true, params: {}});

		if ($(object).length) {
			//console.debug($(object));
			$(object).attr('data-oldvalue', $(object).val());
			$(object).addClass('popsr-Update');

			$(object).mouseover(function(){
				$(object).addClass('popsr-UpdateMO');
			});
			$(object).mouseout(function(){
				$(object).removeClass('popsr-UpdateMO');
			});

			$(object).focus(function(){
				$(object).addClass('popsr-UpdateActive');
			});
			$(object).blur(function(){
				$(object).removeClass('popsr-UpdateActive');
			});
			$($(object)).keyup(function(e) {
				if(e.which == 13) {
					$(object).blur();
				}else if(e.which == 27) {
					$(object).val($(object).attr('data-oldvalue'));
					$(object).blur();
				}

			});

			$(object).blur(function(){
				if ($(object).attr('data-oldvalue')!=$(object).val()){
					var loadObject = new popsr('loading', options);
					popsr_update = $.ajax({
						type: "POST",
						dataType: 'json',
						data: $(object).serialize(),
						url: addParameterToURL($(object).data('popsr-update-url'), token_querystring),
						timeout: options.timeout,
						cache: false,
						error: function (request, status, error) {
							//$(object).val($(object).attr('data-oldvalue'));
							console.debug(request.responseText);
							console.debug(error);
							popsr_close();
							new popsr('Connection error, please try again.', {autoclose:2000});
						},
						success: function(json) {
							console.debug(json);
							if (typeof json.redirect !== "undefined") {
								location.href=URL+json.redirect;
								popsr_close();
							} else {
								if (typeof json.content === "undefined" || json.content.length==0) {
									loadObject.hide();
								} else {
									if ($('.popsr-content').length) {
										loadObject.setContent(json.content);
									} else {
										loadObject = new popsr(json.content, options);
									}
									if ($('.popsr-content img').length) {
										var loaded = 0;
										$('.popsr-content img').load(function() { loaded++; if (loaded == $('.popsr-content img').length) { loadObject.resize(); } });
									}
								}

								if (json.result==true) {
									$(object).attr('data-oldvalue', $(object).val());

								} else {
									$(object).val($(object).attr('data-oldvalue'));
									loadObject.setContent(json.content);
								}
							}
						}
					});
				}
			})
		};
	}
});

function linkPopsr(i) {
	$(i).each(function(index, element){
		$(element).unbind('click', function() { linkPopsrOpen(element); }).bind('click', function() { linkPopsrOpen(element); })
	});
}

function linkPopsrOpen(i) {
	if ($(i).data('det')) { var details=$(i).data('det'); } else { var details={modal:false}; }

	if ($(i).attr('popsr')=='1') { var url = $(i).attr('href'); } else { var url = $(i).attr('popsr'); }
	url = url.replace('#','');
	if ($(i).data("id")) {
		details['setName'] = "popsr_"+$(i).data("id");
		if (!$('.popsr_'+$(i).data("id")).length) new popsr.load(addUrlParam(url, 'psr', '1'), details);
	}
	else {
		new popsr.load(addUrlParam(url, 'psr', '1'), details);
	}
}

function linkPopsrCheck() { $(document).ready(function(){ $('a[popsr="1"]').unbind("click").click(function() { linkPopsrOpen(this); }); }); }
$(document).ajaxComplete(function() { linkPopsrCheck(); });

function popsr_center(id){
	$(id).closest(".popsr-content").trigger("contentchange");
}