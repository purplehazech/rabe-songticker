/**
 * RaBe Songticker.li
 *
 * this is a monolithic javascript file that contains all the 
 * bits and piecees needed for the Songticker. It is split up
 * over various prototype interfaces aiming to be modular so
 * i can use the same code for numerous social sites. as of 
 * now the main targets are a simple js interface for coders
 * that roll their own system as well as a opensocial interface
 * for integration in community webpages (mainly myspace and
 * by way of an opensocial2fb proxy also facebook)
 *
 * the code constist of the following structures
 * - Songticker Prototype
 *   This is where most of the action happens, It delegates 
 *   stuff to
 * - Songticker_Station_RaBe
 *   A place for station specific stuff so i can support 
 *   multiple stations at a later date.
 * - Songticker_Platform_Songtickerli
 *   Platform specific stuff like basic contents of infopopup and love button integration
 * The following Prototypes are not implemented yet
 * - Songticker_Platform_OpenSocial
 * - Songticker_Transport_XHR
 *   Basic transport w/o XSS for use on songticker.li
 * - Songticker_Transport_flXHR
 *   Flash based XSS XHR for use on other domains
 * - Songticker_Transport_OpenSocial
 *   os based cross domain xhr for opensocial
 */

/**
 * main global var Songticker will live in
 */
var songtickerli = {};
/**
 * put site specfic config in here
 */
var _songtickerli_options;
/**
 * global var needed for aa clean flXHR init 
 * used by Songticker_Transport_flXHR and on
 * by default due to flXHRs popularity
 */
var flensed = {};

/**
 * Radio Rabe 95.6 Data
 *
 * Contains all the station specific data as well
 * as hooks for some required callbacks for CSS 
 * styling etc.
 */
function SongTicker_Station_RaBe(options) {
 this.id = 'rabe.ch';
 /**
  * path to ticker feed
  */
 this.path = options.baseurl+'/data/rabe.ch/';
};

function SongTicker_Platform_RaBe(options) {
 this.options = options;

 this.get_style = function() {
   return "";
 };

 this.get_infodiv = function() {
   return "";
 };

};

/**
 * main songticker prototye
 */
function Songticker(station, options) {

 // load options and set defaults
 this.options = options;
 if (typeof this.options.elementid == 'undefined') {
   this.options.elementid = 'songtickerli';
 }
 if (typeof this.options.baseurl == 'undefined') {
   this.options.baseurl = 'http://test.songticker.li';
 }
 if (typeof options.platform == 'undefined') {
   options.platform = 'Songtickerli';
 }
 if (typeof options.transport == 'undefined') {
   options.transport = 'flXHR';
 }
 switch(station) {
   case 'rabe.ch':
     this.station = new SongTicker_Station_RaBe(this.options);
   break;
   default:
     throw Exception('unknown station');
   break;
 }
 switch (options.platform) {
   case 'RaBe':
     this.platform = new SongTicker_Platform_RaBe(this.options);
   break;
   default:
     throw Exception('unknown platform');
   break;
 }
}

 // defer startup if we where called in head
 l = document.getElementsByTagName('body').length;
 if (document.getElementsByTagName('body').length != 1) {
  if (document.addEventListener) {
   document.addEventListener("DOMContentLoaded", function() {
    Songtickerli(station,options);
   }, false);
   return;
  } else {
   // better IE onload?
   window.onload = function() {
    Songtickerli(station,options);
   };
   return;
  }
 }

 /**
  * onTick method
  */
 this.Tick = function () {
  try {
   if (typeof flensed != 'undefined') {
    flensed.flXHR.module_ready();
   } else {
    throw new Exception;
   }
  } catch(e) {
   setTimeout(function() {
    // try again soon hoping flensed has loaded
    songtickerli.Tick();
   }, 10);
  }
  // @todo abstraction layer for request handling to make way for opensocial
  req = flensed.flXHR({
   autoUpdatePlayer: true,
   instancePooling: true
  });
  req.onreadystatechange = function() {
   if (req.readyState == 4) {
    if (req.status == 200 || req.status == 304) {
     // @todo hide timeoutmsg if shown
     if (req.responseText != songtickerli.raw_data) {
      songtickerli.raw_data = req.responseText;
      songtickerli.Load(req.responseXML);
     }
     setTimeout(function() {
      songtickerli.Tick();
     }, 10000);
    }
   }
  };
  req.onerror = function (errorreq) {
   // @todo show timeout msg here
   setTimeout(function() {
    // tick again after waiting a bit longer due to not having network access
    songtickerli.Tick();
   }, 60000);
  };
  req.open('GET', this.station.path);
  req.send(null);
 };

 // trim12 from http://blog.stevenlevithan.com/archives/faster-trim-javascript
 this.trim = function(str) {
  ws = /.*/,
  i = str.length;
  while (ws.test(str.charAt(--i))) {
   return str.slice(0, i + 1);
  }
 };

 this.scroll_text = function(text, len) {
  if (typeof text._index == 'undefined') {
    text._index = 0;
    text._reverse = false;
  }
  if (typeof this.trim(text._text.substr(text._index, len)) != 'undefined') {
   // stay on the first letter for a bit longer by going negative with the index
   if (text._index < 0)
    index = 0;
   else
    index = text._index;
   text.textContent = this.trim(text._text.substr(index, len));
  } else {
   text.textContent = text._text;
  }
  if (text._index + len >= text._text.length) {
    text._reverse = true;
  } else if (text._index <= -3 ) {
    text._reverse = false;
  }
  if (text._reverse) {
    text._index--;
  } else {
    text._index++;
  }
 };

 this.Load = function(xml) {
  message = this.get_span_element(xml,{tagname: 'message', classname: 'message'});
  artist  = this.get_span_element(xml,{tagname: 'artist', classname: 'artist'});
  title   = this.get_span_element(xml,{tagname: 'title', classname: 'title'});
  // store original for processing
  title._text = title.textContent;

  clearInterval(this.titletimeout);
  maxlen = 30;
  if (title.textContent.length > maxlen) {
   this.titlescroll = true;
  }

  if (this.titlescroll == true) {
   songtickerli.scroll_text(title, maxlen);
   this.titletimeout = setInterval("songtickerli.scroll_text(title, maxlen);", 600);
   this.titlescroll = false;
  }

  this.ticker.innerHTML = '';
  this.ticker.appendChild(title);
  this.ticker.appendChild(message);
  this.ticker.appendChild(artist);
 };

 this.initialize_tickergui = function () {
  // load the tags to fill in here
 };

 this.get_span_element = function(xml, options) {
  data = xml.getElementsByTagName(options.tagname);
  if (data[0])
   data = data[0].textContent;
  else
   data = '';
  element = document.createElement('span');
  element.className = 'songtickerli-'+options.classname;
  element.textContent = data;
  return element;
 };

 // this is where the whole ticker get started
 this.initialize_tickergui();
 setTimeout(function() {
  songtickerli.Tick();
 }, 100);
};

function Songtickerli(station, options) {
  songtickerli = new Songticker(station, options);
};

if (typeof _songtickerli_options != "undefined") {
  Songtickerli('rabe.ch', _songtickerli_options);
} else {
  Songtickerli('rabe.ch', {});
}


