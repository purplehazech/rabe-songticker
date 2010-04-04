var SONGTICKERLI_FB = function() {
};
SONGTICKERLI_FB.init = function() {
	FB.init('0b69cbfe795f13e8f415fee381e2d695', 'fb_xd_receiver.html');
	FB.ensureInit(function() {
		SONGTICKERLI_FB.initialized = true;
		if (typeof SONGTICKERLI_FB.registered != 'undefined' || SONGTICKERLI_FB.registered != true) {
			SONGTICKERLI_FB.register();
		}
	});
}
SONGTICKERLI_FB.jStoreReady = function() {
	fb_perms = jQuery.jStore.get('facebook_perms');
	fb_url = jQuery.jStore.get('facebook_url');
	if (fb_perms != '') {
		$('#songtickerli p.facebook-btn').slideUp();
		$('#songtickerli a.facebook-profile-btn').hide();
		SONGTICKERLI_FB.registered = true;
		SONGTICKERLI_FB.init();
	} else {
		$('#songtickerli a.facebook-profile-btn').show();
	}
};
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
		jQuery.jStore.set('facebook_username', FB.Connect.get_loggedInUser());
		jQuery.jStore.set('facebook_url', 'http://www.facebook.com/'+FB.Connect.get_loggedInUser());
		$('.facebook-btn').hide();
		SONGTICKERLI_FB.registered = true;
	}
};

var SONGTICKERLI_TWITTER = function() {
};
SONGTICKERLI_TWITTER.post = function(track) {
};

/**
 * basic container function for songtickerli
 *
 * no private vars whatsoever, since i dont plan
 * on supporting multiple instances of this anyway.
 */
var SONGTICKERLI = function() {
	var storageReady = false;
};
SONGTICKERLI.showLoveDialog = true;
SONGTICKERLI.observers = [];
SONGTICKERLI.artist = 'songticker.li';
SONGTICKERLI.title = 'inializing';
SONGTICKERLI.messate = null;
SONGTICKERLI.starttime = '';
SONGTICKERLI.delay = 0;
/**
 * an array for defining some basic setting fields to load
 */
SONGTICKERLI.configDataFields = [
	{name: 'showLoveDialog', field: SONGTICKERLI.showLoveDialog},
	{name: 'username', field: '#songtickerli input[name=username]'}
];
/**
 * register an observer 
 */
SONGTICKERLI.register_observer = function(observer) {
	SONGTICKERLI.observers[SONGTICKERLI.observers++] = observer;
};
/**
 * call observers that support the love method
 */
SONGTICKERLI.observer_love = function(track) {
	for (var i = 0; i < SONGTICKERLI.observers.length(); i++) {
		if (typeof SONGTICKERLI.observers[i].love == 'function') {
			SONGTICKERLI.observers[i].love(track);
		}
	}
};
/**
 * call observers that support the jStoreReady method for loading data
 */
SONGTICKERLI.observer_jStoreReady = function() {
	for (var i = 0; i < SONGTICKERLI.observers.length(); i++) {
		if (typeof SONGTICKERLI.observers[i].jStoreReady == 'function') {
			SONGTICKERLI.observers[i].jStoreReady();
		}
	}
};
/**
 * main loop responsible for ticking the ticker and starting ajax requesets.
 */
SONGTICKERLI.main = function() {
	// initialize ticker
	SONGTICKERLI.update(SONGTICKERLI.current_track());
	window.setTimeout(function() {
		$('#songtickerli .network-activity').show();
		$.ajax({
			url: '/data/rabe.ch/0.9.1/',
			success: function(data) {
				SONGTICKERLI.artist    = $(data).children('track').children('artist').text();
				SONGTICKERLI.title     = $(data).children('track').children('title').text();
				SONGTICKERLI.message   = $(data).children('track').children('message').text();
				SONGTICKERLI.starttime = $(data).children('track').children('starttime').text();
				SONGTICKERLI.delay = 6000;
				SONGTICKERLI.main();
			},
			error: function() {
				SONGTICKERLI.delay = 60000;
				SONGTICKERLI.main();
			}
		});
	}, SONGTICKERLI.delay);
	if (SONGTICKERLI.delay == 0) {
		SONGTICKERLI.delay = 6000;
	}
};
/**
 * update the ticker if changes are detected
 */
SONGTICKERLI.update = function(track) {
	if (SONGTICKERLI.starttime == $('#songtickerli .starttime').html()) {
		return;
	}
	// clone old data to history
	SONGTICKERLI.update_history();

	// load new data
	if (track.artist) {
		$('#songtickerli .overlay .artist').html(track.artist);
		$('#songtickerli .overlay .title').html(track.title);
	} else if (track.message) {
		$('#songtickerli .overlay .artist').html(track.message);
	} else {
		$('#songtickerli .overlay .artist').html(track.title);
	}

	$('#songtickerli .overlay .starttime').html(SONGTICKERLI.starttime);
};
SONGTICKERLI.update_history = function() {
	hist = $('#songtickerli .scroller-history');

	overlay = $('#songtickerli .overlay').clone();
	overlay.removeClass().addClass('history-data').css('background', 'white');
	info    = $('#songtickerli .scroller-info').clone();
	info.removeClass().addClass('history-info').appendTo($(overlay));
	overlay.hide();

	if ($(overlay).children('.artist').html() == '') {
		return;
	}

	hist.prepend(overlay);
	overlay.slideDown();
	$('#songtickerli .scroller-history .button').remove();
};
SONGTICKERLI.love_track = function(current) {
	if (!SONGTICKERLI.configured()) {
		SONGTICKERLI.show($('#songtickerli .scroller-conf'));
	}
	if (typeof SONGTICKERLI.showLoveDialog == 'undefined' || SONGTICKERLI.showLoveDialog) {
		SONGTICKERLI.show($('#songtickerli .scroller-love'));
	} else {
		SONGTICKERLI.observer_love(SONGTICKERLI.current_track());
	}
};
SONGTICKERLI.love_track_okcallback = function() {
	SONGTICKERLI.observer_love(SONGTICKERLI.current_track(), $('#songtickerli .love-message').val());
};
SONGTICKERLI.current_track = function() {
	return {
		artist:    SONGTICKERLI.artist,
		title:     SONGTICKERLI.title,
		message:   SONGTICKERLI.message,
		starttime: SONGTICKERLI.starttime
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

	// social networks
	SONGTICKERLI.observer_jStoreReady();

	// value_maps
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
	$('#songtickerli button[name=post-love]').click(SONGTICKERLI.love_track_okcallback);
	$('#songtickerli .info').click(function() {
		SONGTICKERLI.show($('#songtickerli .scroller-info'));
	});
	$('#songtickerli .history').click(function() {
		SONGTICKERLI.show($('#songtickerli .scroller-history'));
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

