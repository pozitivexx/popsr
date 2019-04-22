/*
 * written by aakpinar at 03.08.2012
 * v2.00
 */
var popsrCount = 0;
function popsr(data, options) {
	if ($('#popsr' + popsrCount).length) popsrCount++;
	var _this = this;
	_this.options = $.extend({}, popsr.prototype.options, options || {});
	_this.popsr = $(_this.template());
	_this.setContent(data);

	_this.options.transparent = _this.options.transparent == null || _this.options.transparent == '' || !_this.options.transparent ? "" : " tbg";

	if (_this.options.title == null) {
		$('.popsr-titlebox', _this.popsr).remove();
		$('.modal-header', _this.popsr).addClass('onlybtn');
	} else {
		if (_this.options.titleLink == null) {
			$('.popsr-title', _this.popsr).append(_this.options.title);
		} else {
			$('.popsr-title', _this.popsr).append('<a href="' + _this.options.titleLink + '">' + _this.options.title + '</a>');
		}
		if ((_this.options.buttons.length === 0 && !_this.options.autoclose) || _this.options.closeButton) {
			if (_this.options.closeButton) {
			}
		}
		if (_this.options.titleClass != null) $('.popsr-titlebox', this.popsr).addClass(_this.options.titleClass); else $('.popsr-titlebox', this.popsr).addClass('anim');
	}

	if (_this.options.buttons.length > 0) {
		for (var i = 0; i < _this.options.buttons.length; i++) {
			var cls = (_this.options.buttons[i]["class"]) ? _this.options.buttons[i]["class"] : '';
			var btn = $('<span class="btnbox"><button id="" class="btn btn-primary ' + cls + '" href="#">' + _this.options.buttons[i].label + '</button></span>')
				.data('value', _this.options.buttons[i].val);
			btn.bind("click", function () {
				var e = $.data(this, "value");
				var t = _this.options.callback != null ? function () {
					_this.options.callback(e)
				} : null;
				_this.hide(t)
			});
			$('.popsr-actions', this.popsr).append(btn);
		}
	} else {
		$('.modal-footer', this.popsr).remove();
	}
	if (_this.options.buttons.length === 0 && _this.options.title == null && !_this.options.autoclose) {
		if (_this.options.closeButton) {
		}
	}

	if (_this.options.show) {
		_this.show();
		$('.btnbox button').focus();
	}
	if (!_this.options.dontClose) {
	}

	$(_this.popsr).on("hidden.bs.modal", function () {
		_this.hide();
	});

	if (_this.options.autoclose != null) {
		setTimeout(function (_this) {
			_this.hide();
		}, _this.options.autoclose, this);
	}
	return _this;
}
popsr.prototype = {
	options: {
		transparent: '',
		timeout: 15000,
		setName: '',
		autoclose: null,
		buttons: [],
		callback: null,
		closeback: null,
		center: true,
		closeButton: true,
		title: null,
		titleClass: null,
		modal: true,
		modalOpacity: .6,
		dontClose: false,
		show: true,
		zIndex: 9998,
		disableWidth:false,
	},
	template: function () {
		return '' +
			'<div class="modal popsr ' + (this.options.transparent) + ' ' + this.options.setName + '" id="popsr' + popsrCount + '">' +
			'<div class="modal-dialog" style="'+(this.options.disableWidth ? 'width:unset':'')+'">' +
			'<div class="modal-content">' +
			'<div class="modal-header">' +
			'<button type="button" class="close" data-dismiss="modal">&times;</button>' +
			'<div class="modal-title popsr-title"></div>' +
			'</div>' +
			'<div class="modal-body popsr-content">test</div>' +
			'<div class="modal-footer"><div class="popsr-actions"></div></div>' +
			'</div>' +
			'</div>' +
			'</div>';
	},
	content: '<div></div>',
	visible: false,
	setContent: function (data) {
		if (jQuery.type(data) !== "object") {
			if (typeof this.options.type !== "undefined" && this.options.type == 'iframe') {

			} else {
				if (typeof data !== "undefined") {
					if (data.length && data.replace(/(<([^>]+)>)/ig, "").length < 75) data = "<div class=\"popsr-inform\">" + data + "</div>";
				} else {
					data = "<div class=\"popsr-inform\">Error</div>";
				}
			}
		}

		$('.popsr-content', this.popsr)
			.empty()
			.append(data)
			.trigger("contentchange");
	},
	show: function () {
		if (this.visible) return;
		if (this.options.modal && this.modal != null) {

		}
		this.popsr.appendTo(document.body);
		this.popsr.css({'z-index': this.options.zIndex + $('.popsr').length}).modal('show');
		this.visible = true;
	},

	hide: function (after) {
		if (!this.visible) return;
		var _this = this;

		_this.popsr.modal( 'hide' ).data( 'bs.modal', null );

		//_this.popsr.remove();

		if (after) after.call();
		if (!$('.popsr').length) history.pushState("", document.title, window.location.pathname + window.location.search);

		if (_this.options.modal && _this.modal != null) {

		}
		if (_this.options.closeback != null) _this.options.closeback();

		return this;
	},
	toggle: function () {
		this[this.visible ? 'hide' : 'show']();
		return this;
	},
};

$.extend(popsr, {
	close: function(){
		if ($('.popsr').length) {
			$('.popsr').remove();
		}
		if ($('.popsr-modal').length) {
			$('.popsr-modal').remove();
		}
		history.pushState("", document.title, window.location.pathname + window.location.search);
	},
	alert: function (data, options) {
		var buttons = [{id: 'ok', label: 'OK', val: 'OK'}];
		options = $.extend({
			closeButton: false, buttons: buttons, callback: function () {
			}
		}, options || {}, {show: true});
		return new popsr(data, options);
	},
	ask: function (data, callback, options) {
		var buttons = [
			{id: 'yes', label: 'Yes', val: 'Y', "class": 'btn-success'},
			{id: 'no', label: 'No', val: 'N', "class": 'btn-danger'},
		];
		options = $.extend({
			closeButton: false, modal: true, buttons: buttons, callback: function () {
			}
		}, options || {}, {show: true, callback: callback});
		return new popsr(data, options);
	},
	json: function (url, options, callback) {
		options = $.extend(options || {}, {show: true, params: {}});
		var loadObject = new popsr('loading', options);

		return $.ajax({
			type: "POST",
			data: options.data,
			url: url,
			async: false,
			crossDomain: true,
			xhrFields: {withCredentials: true},
			dataType: 'json',
			timeout: options.timeout,
			cache: false,
			error: function (request, status, error) {
				console.debug(request.responseText);
				console.debug(error);
				popsr.close();
				new popsr('Connection error. Please try again later.', {autoclose: 2000});
			},
			success: function (json) {
				if (typeof json.redirect !== "undefined") {
					location.href = URL + json.redirect;
					popsr.close();
				} else {
					//console.debug(json);
					if (typeof json.content === "undefined" || json.content.length == 0) {
						loadObject.hide();
					} else {
						if ($('.popsr-content').length) {
							loadObject.setContent(json.content);
						} else {
							loadObject = new popsr(json.content, options);
						}
						if ($('.popsr-content img').length) {
							var loaded = 0;
							$('.popsr-content img').load(function () {
								loaded++;
							});
						}
					}
				}

				if (typeof callback !== 'undefined' && callback !== null) {
					callback();
				}
			}
		});
	},
	loading: function (x) {
		console.debug(x);
	},
	load: function (url, options) {
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
				popsr.close();
				new popsr('Connection error, please try again.', {autoclose: 2000});
			},
			success: function (html) {
				if ($('.popsr-content').length) {
					loadObject.setContent(html);
				} else {
					loadObject = new popsr(html, options);
				}

				if (html.length == 0) {
					loadObject.hide();
				}
				else {

					if ($('.popsr-content img').length) {
						var loaded = 0;
						$('.popsr-content img').load(function () {
							loaded++;
						});
					}
				}
			}
		});
	},

	iframe: function (url, options) {
		options = $.extend(options || {type: 'iframe'}, {show: true, params: {}});
		loadObject = new popsr('<iframe src="' + url + '" frameborder="0" style="" />', options);
	},
	img: function(src, options) {
		new popsr.loading.create();
		var img = $(new Image()).attr('src', src);
		$(img).load(function() {
			var vp = {width: $(window).width() - 50, height: $(window).height() - 50};
			var ratio = (this.width > vp.width || this.height > vp.height) ? Math.min(vp.width / this.width, vp.height / this.height) : 1;
			//$(img).css({width: this.width * ratio, height: this.height * ratio});
			options = $.extend(options || {}, {
				show: true, closeButton: true,
				//width: this.width * ratio, height: this.height * ratio,
				padding: 0,
				disableWidth:true,
			});
			new popsr.loading.remove();
			new popsr(img, options);
		}).error(function() {
			new popsr.loading.remove();
			console.log('Error loading ' + src);
		}).attr('src', src);
	},
	update: function (object, options) {
		options = $.extend(options || {}, {show: true, params: {}});

		if ($(object).length) {
			//console.debug($(object));
			$(object).attr('data-oldvalue', $(object).val());
			$(object).addClass('popsr-Update');

			$(object).mouseover(function () {
				$(object).addClass('popsr-UpdateMO');
			});
			$(object).mouseout(function () {
				$(object).removeClass('popsr-UpdateMO');
			});

			$(object).focus(function () {
				$(object).addClass('popsr-UpdateActive');
			});
			$(object).blur(function () {
				$(object).removeClass('popsr-UpdateActive');
			});
			$($(object)).keyup(function (e) {
				if (e.which == 13) {
					$(object).blur();
				} else if (e.which == 27) {
					$(object).val($(object).attr('data-oldvalue'));
					$(object).blur();
				}

			});

			$(object).blur(function () {
				if ($(object).attr('data-oldvalue') != $(object).val()) {
					var loadObject = new popsr('loading', options);
					popsr_update = $.ajax({
						type: "POST",
						dataType: 'json',
						crossDomain: true,
						xhrFields: {withCredentials: true},
						data: $(object).serialize(),
						url: $(object).data('popsr-update-url'),
						timeout: options.timeout,
						cache: false,
						error: function (request, status, error) {
							//$(object).val($(object).attr('data-oldvalue'));
							popsr.close();
							new popsr('Connection error, please try again.', {autoclose: 2000});
						},
						success: function (json) {

							if (typeof json.redirect !== "undefined") {
								location.href = URL + json.redirect;
								popsr.close();
							} else {
								if (typeof json.content === "undefined" || json.content.length == 0) {
									loadObject.hide();
								} else {
									if ($('.popsr-content').length) {
										loadObject.setContent(json.content);
									} else {
										loadObject = new popsr(json.content, options);
									}
									if ($('.popsr-content img').length) {
										var loaded = 0;
										$('.popsr-content img').load(function () {
											loaded++;
										});
									}
								}

								if (json.result == true) {
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
		}
	}
});
$.extend(popsr.loading, {
	create: function () {
		var loading = $("<div id='loadingfnc' style='position: fixed;top:0;left:0;width:100%;height:100%;z-index:10000;background:rgba(255,255,255,0.2);'><img src='" + THEMEURL + "/images/loading.gif' width='30' height='30' style='position: fixed;left: 0;right: 0;margin: auto;top: 50%;transform: translateY(-50%);' /></div>");
		loading.appendTo($('body'));
	},
	remove: function () {
		$('#loadingfnc').remove();
	}
});
