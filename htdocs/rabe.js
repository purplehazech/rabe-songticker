var SONGTICKERLI_FB = function() {
};
SONGTICKERLI_FB.init = function() {
	FB.init('0b69cbfe795f13e8f415fee381e2d695', 'xd_receiver.html');
	FB.ensureInit(function() {
		SONGTICKERLI_FB.initialized = true;
		SONGTICKERLI_FB.register();
	});
}
SONGTICKERLI_FB.post = function(track) {
	FB.Connect.streamPublish(track.artist + ' ' + track.title);
};
SONGTICKERLI_FB.post_callback = function() {
};
SONGTICKERLI_FB.register = function() {
	FB.Connect.requireSession(SONGTICKERLI_FB.register_callback_ok, SONGTICKERLI_FB.register_callback_cancel);
};
SONGTICKERLI_FB.register_callback_ok = function() {
	FB.Connect.showPermissionDialog('offline_access,publish_stream', SONGTICKERLI_FB.register_callback_perms);
};
SONGTICKERLI_FB.register_callback_cancel = function() {
	$('.facebook-btn').show();
}
SONGTICKERLI_FB.register_callback_perms = function(perms) {
	if (perms) {
		jQuery.jStore.set('facebook_perms', perms);
		$('.facebook-btn').hide();
	}
};

var SONGTICKERLI_TWITTER = function() {
};
SONGTICKERLI_TWITTER.post = function(track) {
};

var SONGTICKERLI = function() {
	var storageReady = false;
	var showLoveDialog = true;
	var observers = [];

};
SONGTICKERLI.artist = 'songticker.li';
SONGTICKERLI.title = 'inializing';
SONGTICKERLI.configDataFields = [
	{name: 'showLoveDialog', field: SONGTICKERLI.showLoveDialog},
	{name: 'username', field: '#songtickerli input[name=username]'}
];
SONGTICKERLI.register_observer = function(observer) {
	$(SONGTICKERLI.observers).append(observer);
};
SONGTICKERLI.main = function() {
	// initialize ticker
	SONGTICKERLI.update(SONGTICKERLI.current_track());
};
SONGTICKERLI.update = function(track) {
	$('#songtickerli .artist').val(track.artist);
	$('#songtickerli .title').val(track.title);
};
SONGTICKERLI.love_track = function(current) {
	if (!SONGTICKERLI.configured()) {
		SONGTICKERLI.show($('#songtickerli .scroller-conf'));
	}
	if (SONGTICKERLI.showLoveDialog) {
		SONGTICKERLI.show($('#songtickerli .scroller-love'));
	}
};
SONGTICKERLI.current_track = function() {
	return {
		artist: SONGTICKERLI.artist,
		title:  SONGTICKERLI.title
	}
};
SONGTICKERLI.show = function(choice) {
	if ($('#songtickerli .scroller').is(':hidden')) {
		$('#songtickerli .scrollersub').hide();
		choice.show();
		$('#songtickerli .scroller').slideDown();
	} else {
		if (choice.is(':hidden')) {
			$('#songtickerli .scrollersub').slideUp();
			choice.slideDown();
		}
	}
};
SONGTICKERLI.switch_color = function(color) {
	// save new default color
	jQuery.jStore.set('color', color);
	// switch css
	$('#songtickerli').css('color', SONGTICKERLI.get_colorset(color).color);
	$('#songtickerli .overlay').css('background-color', SONGTICKERLI.get_colorset(color).background);
	$('#songtickerli .scroller').css('background-color', SONGTICKERLI.get_colorset(color).background);
	// switch logo
	$('#songtickerli').css('background', 'white url('+SONGTICKERLI.get_colorset(color).logo+') no-repeat 300px');
	SONGTICKERLI.set_configured();
};
SONGTICKERLI.save_username = function(name) {
	jQuery.jStore.set('username', name);
	SONGTICKERLI.set_configured();
};
SONGTICKERLI.configured = function() {
	if (jQuery.jStore.get('configured') == 'yes') {
		SONGTICKERLI.set_configured();
		return true
	} else if (jQuery.jStore.get('configured') == 'no') {
		return false
	} else {
		return false
	}
};
SONGTICKERLI.set_configured = function() {
	jQuery.jStore.set('configured', 'yes');
	$('#songtickerli .unconfigured').hide();
};
SONGTICKERLI.get_colorset = function(color) {
	if (color=='blau') {
		return {
			color: 'blue',
			background: 'rgba(200, 200, 255, 0.5)',
			logo: 'data:image/png;base64,png_token[[[logo_rabe_blau]]]'
		}
	} else if (color=='gruen') {
		return {
			color: 'green',
			background: 'rgba(200, 255, 200, 0.5)',
			logo: 'data:image/png;base64,png_token[[[logo_rabe_gruen_weiss]]]'
		}
	} else if (color=='orange') {
		return {
			color: 'orange',
			background: 'rgba(255, 255, 200, 0.5)',
			logo: 'data:image/png;base64,png_token[[[logo_rabe_orange_weiss]]]'
		}
	} else if (color=='rot') {
		return {
			color: 'red',
			background: 'rgba(255, 200, 200, 0.5)',
			logo: 'data:image/png;base64,png_token[[[logo_rabe_rot_weiss]]]'
		}
	} else {
		return {
			color: 'blue',
			background: 'rgba(200, 200, 255, 0.5)',
			logo: 'data:image/png;base64,png_token[[[logo_rabe_blau]]]'
		}
	}
}

jQuery.extend(jQuery.jStore.defaults, {  
	project: 'songtickerli',
});
jQuery.jStore.ready(function(engine){ 
	SONGTICKERLI.storageReady = true;

	// init color stuff
	color = jQuery.jStore.get('color');
	SONGTICKERLI.switch_color(color);

	// radio button
	$('#songtickerli input[value='+color+']:nth(0)').attr('checked','checked');
	
	for (var i = 0; i < SONGTICKERLI.configDataFields.length; i++) {
		data = SONGTICKERLI.configDataFields[i];
		$(data.field).val(jQuery.jStore.get(data.name));
	}
})

jQuery(document).ready(function() {

	$('#songtickerli').hover(function() {
		$('#songtickerli .button').fadeIn();
	}, function() {
		$('#songtickerli .button').fadeOut();
		$('#songtickerli .scroller').slideUp();
	});
	$('#songtickerli .love').click(function() {
		SONGTICKERLI.love_track(SONGTICKERLI.current_track());
	});
	$('#songtickerli .info').click(function() {
		SONGTICKERLI.show($('#songtickerli .scroller-info'));
	});
	$('#songtickerli .conf').click(function() {
		SONGTICKERLI.show($('#songtickerli .scroller-conf'));
	});
	$('#songtickerli input[name=color]').click(function() {
		SONGTICKERLI.switch_color(this.value);
	});
	$('#songtickerli input[name=username]').blur(function() {
		SONGTICKERLI.save_username(this.value);
	});
	$('#songtickerli p.facebook-btn').click(function() {
		SONGTICKERLI_FB.init();
	});
	
	jQuery.jStore.load();
	SONGTICKERLI.register_observer(SONGTICKERLI_FB);
	SONGTICKERLI.register_observer(SONGTICKERLI_TWITTER);
	SONGTICKERLI.main();
});

