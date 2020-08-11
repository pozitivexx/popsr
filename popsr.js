/*
 * written by aakpinar at 03.08.2012
 * v2.12
 */

var $ = jQuery.noConflict();
var popsrCount = 0;
window.popsr = function (data, options) {
	if ($('#popsr' + popsrCount).length) popsrCount++;
	var _this = this;
	_this.options = $.extend({}, popsr.prototype.options, options || {});

	if (_this.options.dataobject !== null && (!data || !data.length)) {
		data = _this.options.dataobject.html();
	}

	if (data === "loading") {
		data = $("<div id='loadingfnc' style=''><img src='" + THEMEURL + "images/loading.gif' style='' /></div>");
	}

	if (_this.options.disableClose) {
		_this.options.closeButton = false;
	}

	_this.options.transparent =
		_this.options.transparent === null ||
		_this.options.transparent === '' ||
		!_this.options.transparent ?
			"" :
			(
				typeof (_this.options.transparent) === 'boolean' ?
					' tbg' :
					' ' + _this.options.transparent
			);

	_this.popsr = $(_this.template());
	_this.setContent(data);

	if (_this.options.title === null) {
		$('.popsr-titlebox', _this.popsr).remove();
		$('.modal-header', _this.popsr).addClass('onlybtn');
	} else {
		$('.popsr-title', _this.popsr).append(
			_this.options.titleLink === null ?
				_this.options.title :
				'<a href="' + _this.options.titleLink + '">' + _this.options.title + '</a>'
		);
		if ((_this.options.buttons.length === 0 && !_this.options.autoclose) || _this.options.closeButton) {
			if (_this.options.closeButton) {
			}
		}
		if (_this.options.titleClass !== null) $('.popsr-titlebox', this.popsr).addClass(_this.options.titleClass); else $('.popsr-titlebox', this.popsr).addClass('anim');
	}

	if (_this.options.buttons.length > 0) {
		for (var i = 0; i < _this.options.buttons.length; i++) {
			var cls = typeof(_this.options.buttons[i]["class"]) !== 'undefined' && _this.options.buttons[i]["class"].length ? _this.options.buttons[i]["class"] : 'btn btn-success';
			var btn = $('<button id="" class="btnbox ' + cls + '" href="#">' + _this.options.buttons[i].label + '</button>')
				.data('value', _this.options.buttons[i].val)
				.bind("click", function () {
					var e = $.data(this, "value");

					/* run callback with value here after set null */
					if (_this.options.callback !== null) {
						_this.options.callback(e);
						_this.options.callback = null;
					}
					_this.hide(null)
				});
			$('.popsr-actions', this.popsr).append(btn);
		}
	} else {
		$('.modal-footer', this.popsr).remove();
	}
	if (_this.options.buttons.length === 0 && _this.options.title === null && !_this.options.autoclose) {
		if (_this.options.closeButton) {
		}
	}

	if (_this.options.show) {
		_this.show();
		$('.popsr-actions button:first-child').focus();
	}

	$(_this.popsr).on("hidden.bs.modal", function () {
		_this.hide();
	});

	if (_this.options.autoclose !== null) {
		setTimeout(function (_this) {
			_this.hide();
		}, _this.options.autoclose, this);
	}
	return _this;
};

popsr.prototype = {
	options: {
		dataobject: null,
		transparent: '',
		timeout: 15000,
		setName: '',
		afterShow: null,
		autoclose: null,
		buttons: [],
		callback: null,
		disableClose: false,
		closeback: null,
		center: true,
		closeButton: true,
		title: null,
		titleClass: null,
		parent: null,
		modal: true,
		modalOpacity: .6,
		show: true,
		zIndex: 9998,
		disableWidth: false,
	},
	template: function () {
		return '' +
			'<div class="modal popsr ' + (this.options.transparent) + ' ' + this.options.setName + '" id="popsr' + popsrCount + '" ' + (this.options.disableClose ? 'data-keyboard="false" data-backdrop="static"' : '') + '>' +
			'<div class="modal-dialog container" style="' + (this.options.disableWidth ? 'max-width:unset!important' : '') + '">' +
			'<div class="modal-content">' +
			'<div class="modal-header">' +
			'<div class="modal-title popsr-title"></div>' +
			(this.options.closeButton ? '<button type="button" class="close" data-dismiss="modal">&times;</button>' : '') +
			'</div>' +
			'<div class="modal-body popsr-content"></div>' +
			'<div class="modal-footer popsr-actions"></div>' +
			'</div>' +
			'</div>' +
			'</div>';
	},
	content: '<div></div>',
	visible: false,
	setContent: function (data) {
		if (typeof(data) !== "object") {
			if (typeof this.options.type !== "undefined" && this.options.type === 'iframe') {

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
			.trigger("contentchange")
		;
	},
	show: function () {
		if (this.visible) return;

		this.popsr.appendTo(this.options.parent !== null ? this.options.parent : document.body);

		var zIndex = parseInt(this.options.zIndex) + ($('.popsr').length * 2) + 1;
		this.popsr.css({'z-index': zIndex});

		if (this.options.modal && this.modal !== null) {
			this.popsr.on('shown.bs.modal', function () {
				$(this).next('.modal-backdrop').css('z-index', zIndex - 1);
			});
		}

		this.popsr.modal('show');
		this.visible = true;

		this.popsr.animate({
			scrollTop: 0
		}, 100);

		if (typeof this.options.afterShow === 'function') {
			this.options.afterShow(this.popsr);
		}
	},

	hide: function (after) {
		if (!this.visible) return;
		var _this = this;

		if (typeof (after) === 'undefined') {
			if (_this.options.callback !== null) {
				_this.options.callback(0);
			}
		}

		_this.popsr.modal('hide').data('bs.modal', null).remove();

		if (after) after.call();
		if (!$('.popsr').length) history.pushState("", document.title, window.location.pathname + window.location.search);

		if (_this.options.modal && _this.modal !== null) {

		}
		if (_this.options.closeback !== null) _this.options.closeback();

		return this;
	},
	toggle: function () {
		this[this.visible ? 'hide' : 'show']();
		return this;
	},
};

$.extend(popsr, {
	close: function (obj) {
		var popsr_obj = typeof obj === 'string' ? $('.popsr.' + obj) : $('.popsr');
		popsr_obj.modal('hide').remove();
		history.pushState("", document.title, window.location.pathname + window.location.search);
	},
	alert: function (data, options) {
		var buttons = [{id: 'ok', label: 'OK', val: 'OK'}];
		options = $.extend({
			closeButton: false,
			buttons: buttons,
			callback: function () {
			}
		}, options || {}, {show: true});
		return new popsr(data, options);
	},
	ask: function (data, callback, options) {
		var buttons = [
			{id: 'yes', label: 'Yes', val: 'Y', "class": 'btn btn-success'},
			{id: 'no', label: 'No', val: 'N', "class": 'btn btn-danger'},
		];
		options = $.extend({
				closeButton: false,
				modal: true,
				buttons: buttons,
				callback: function () {
				}
			}, options || {},
			{
				show: true,
				callback: callback
			});
		return new popsr(data, options);
	},
	exist: function () {
		return $('.popsr').length;
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
					if (typeof json.content === "undefined" || json.content.length == 0) {
						loadObject.hide();
					} else {
						if ($('.popsr-content').length) {
							loadObject.setContent(json.content);
						} else {
							loadObject = new popsr(json.content, options);
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
	},

	load: function (url, options, after) {
		options = $.extend(options || {}, {show: true, params: {}});
		var loadObject = new popsr('loading', options);

		$.ajax({
			type: "POST",
			data: options.data,
			url: url,
			timeout: options.timeout,
			cache: false,
			crossDomain: true,
			xhrFields: {withCredentials: true},
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

				if (html.length === 0) {
					loadObject.hide();
				}

				if (typeof (after) !== 'undefined' && after) {
					after.call();
				}

			}
		});
	},

	iframe: function (url, options) {
		options = $.extend(options || {}, {type: 'iframe', show: true, params: {}});
		loadObject = new popsr('<iframe src="' + url + '" frameborder="0" style="" />', options);
	},
	img: function (src, options) {
		new popsr.loading.create();
		var img = $(new Image()).attr('src', src).addClass('img-responsive').css({
			'max-height': '100%',
			'max-width': '100%'
		});
		new popsr(img, $.extend(options || {}, {
			show: true, closeButton: true,
			//width: this.width * ratio, height: this.height * ratio,
			padding: 0,
			disableWidth: true,
		}));
		new popsr.loading.remove();
	},
	update: function (object, options) {
		options = $.extend(options || {}, {show: true, params: {}});

		if ($(object).length) {
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
		if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
			console.debug("jQuery popsr: Blocked safari");
			return false;
		}
		new popsr('loading', {
			disableClose: true,
			transparent: true
		});
	},
	remove: function () {
		if ($('#loadingfnc').length){
			$('#loadingfnc').closest('.popsr').modal('toggle');
		}
	}
});