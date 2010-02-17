var songtickerli = {};
var _songtickerli_options;
var flensed;

function SongTicker_Station_RaBe(options) {
 this.id = 'rabe.ch';
 this.path = options.baseurl+'/data/rabe.ch/0.9.1/';
 this.type = 'xml';
 this.name = 'Radio RaBe 95.6 MHz';
 this.url  = 'http://www.rabe.ch';
 //this.infopopup = 'http://www.rabe.ch/songticker.html';
 this.infopopup = options.baseurl+'/testpopup.html';

 if (typeof options.colorscheme == 'undefined') {
   options.colorscheme = 'green';
 }

 switch (options.colorscheme) {
   case 'red':
   case 'blue':
   case 'orange':
   case 'green':
   default:
     this.logo = options.baseurl+'/rabe_gruen.png';
     this.foreground_color = '#C4E218';
     this.background_color = '#1C2734';
   break;
 }

 this.get_style = function() {
   s  = ".rabe-songtickerli-infopopup-frame { ";
   s += " overflow: hide; ";
   s += "} ";
   return s;
 };

 this.get_infopopup = function() {
   rabeframe = document.createElement('iframe');
   rabeframe.className = 'rabe-songtickerli-infopopup-frame';
   return rabeframe;
 };

};

function SongTicker_Platform_Songtickerli(options) {
 this.options = options;

 this.get_style = function() {
   return "";
 };

 this.get_infodiv = function() {
   div = document.createElement('div');
   div.textContent = 'Hol dir den Ticker für deine Homepage auf: ';
   link = document.createElement('a');
   link.href = 'http://songticker.li';
   link.target = '_parent';
   link.textContent = 'http://songticker.li';
   div.appendChild(link);

   return div;
 };

};

function Songticker(station, options) {
 this.options = options;
 if (typeof this.options.elementid == 'undefined') {
   this.options.elementid = 'songtickerli';
 }
 if (typeof this.options.baseurl == 'undefined') {
   this.options.baseurl = 'http://dev.songticker.li';
 }
 if (typeof options.platform == 'undefined') {
   options.platform = 'Songtickerli';
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
   case 'Songtickerli':
     this.platform = new SongTicker_Platform_Songtickerli(this.options);
   break;
   default:
     throw Exception('unknown platform');
   break;
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


 this.Tick = function () {
  try {
   if (typeof flensed != 'undefined') {
    flensed.flXHR.module_ready();
   } else {
    throw new Exception;
   }
  } catch(e) {
   setTimeout(function() {
    songtickerli.Tick();
   }, 10);
  }
  req = flensed.flXHR({
   autoUpdatePlayer: true,
   instancePooling: true
  });
  req.onreadystatechange = function() {
   if (req.readyState == 4) {
    if (req.status == 200 || req.status == 304) {
     // hide timeoutmsg if shown
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
   // show timeout msg here
   setTimeout(function() {
    songtickerli.Tick();
   }, 60000);
  };
  req.open('GET', this.station.path);
  req.send(null);
 };

 // trim12 from http://blog.stevenlevithan.com/archives/faster-trim-javascript
 this.trim = function(str) {
  ws = /\s/,
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
   text.textContent = this.trim(text._text.substr(text._index, len));
  } else {
   text.textContent = text._text;
  }
  if (text._index + len >= text._text.length) {
    text._reverse = true;
  } else if (text._index <= 0) {
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

  maxlen = 30;
  if (title.textContent.length > maxlen) {
   this.titlescroll = true;
  } else {
   clearInterval(this.titletimeout);
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
  doc = document.getElementById(this.options.elementid);
  if (typeof doc == 'undefined' || doc == null) {
    doc = document.createElement('div');
    doc.id = this.options.elementid;
    body = document.getElementsByTagName('body')[0];
    body.appendChild(doc);
  }

  headerdiv = document.createElement('div');
  headerdiv.className = 'songtickerli-header';

  flensedscript = document.createElement('script');
  flensedscript.type = 'text/javascript';
  flensedscript.src = this.options.baseurl+'/flensed/flXHR.js';
  flensedscript.style.display = 'none';
  doc.appendChild(flensedscript);

  tickerstyle = document.createElement('style');
  tickerstyle.type = 'text/css';
  tickerstyle.setAttribute("type", "text/css");
  s  = "#songtickerli { ";
  s += " border: 1px solid #303030; ";
  s += " background: "+this.station.background_color+"; ";
  s += " width: 223px; ";
  s += " padding-left: 62px; ";
  s += " padding-right: 2px; ";
  s += " background: url("+this.station.logo+") no-repeat scroll 2px 2px "+this.station.background_color+"; ";
  s += " -moz-border-radius: 6px; ";
  s += " -webkit-border-radius: 6px; ";
  s += " border-radius: 6px; ";
  s += " } ";
  s += ".songtickerli-canvas { ";
  s += " text-align: center; ";
  s += " margin-left: 2px; ";
  s += " width: 219px; ";
  s += " height: 43px; ";
  s += " background: url("+this.options.baseurl+"/bg_songticker.gif) no-repeat scroll left top; ";
  s += " color: #E7501E; ";
  s += " font-family: 'bitstream vera sans','lucida grande',verdana,sans-serif; ";
  s += " font-size: 10px; ";
  s += " padding-top: 10px; ";
  s += " padding-left: 3px; ";
  s += " padding-right: 6px; ";
  s += " } ";
  s += ".songtickerli-message { ";
  s += " font-weight: bold; ";
  s += " text-transform: uppercase; ";
  s += " } ";
  s += ".songtickerli-title { ";
  s += " display: block; ";
  s += " font-weight: bold; ";
  s += " text-transform: uppercase; ";
  s += " } ";
  s += ".songtickerli-artist { ";
  s += " color: #505260; ";
  s += " } ";
  s += ".songtickerli-header { ";
  s += " font-size: 70%; ";
  s += " padding: 0.25em; ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " } ";
  s += ".songtickerli-ticker-right { ";
  s += " right: 2px; ";
  s += " float: right; ";
  s += " color: #00B3E6; ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " text-align: right; ";
  s += " } ";
  s += ".songtickerli-ticker-right { ";
  s += " background: transparent; ";
  s += " padding-bottom: 10px; ";
  s += " } ";
  s += ".songtickerli-ticker-left { ";
  s += " color: #00B3E6; ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " text-align: left; ";
  s += " } ";
  s += ".songtickerli-ticker-info { ";
  s += " background: transparent; ";
  s += " position: absolute; ";
  s += " margin-top: 0px; ";
  s += " width: 220px; ";
  s += " height: 70px; ";
  s += " display: none; ";
  s += " z-index: 6000;";
  s += " } ";
  s += ".songtickerli-ticker-info-link { ";
  s += " font-weight: bold; ";
  s += " font-size: 90%; ";
  s += " padding-right: 5px; ";
  s += "} ";
  s += ".songtickerli-ticker-info-overlay div { ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " color: "+this.station.foreground_color+"; ";
  s += "} ";
  s += ".songtickerli-ticker-info-overlay { ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " text-align: center; ";
  s += " position: absolute; ";
  s += " margin-top: 20px; ";
  s += " margin-left: 1px; ";
  s += " width: 220px; ";
  s += " height: 50px; ";
  s += " -moz-border-radius: 6px; ";
  s += " -webkit-border-radius: 6px; ";
  s += " border-radius: 6px; ";
  s += " font-size: 70%; ";
  s += " } ";
  s += ".songtickerli-station-info { ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " position: absolute; ";
  s += " margin-top: -15px; ";
  s += " display: none; ";
  s += " } ";
  s += ".songtickerli-station-info iframe { ";
  s += " border: 0; ";
  s += " overflow: hide; ";
  s += " background: transparent; ";
  s += " } ";
  s += "#songtickerli a { ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " text-decoration: none; ";
  s += " } ";
  s += "#songtickerli a:link, #songtickerli a:visited, #songtickerli a:active { ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " } ";
  s += "#songtickerli a:hover { ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " text-decoration: underline; ";
  s += " } ";
  s += ".flXHRhideSwf { ";
  s += " display:block; ";
  s += " background: transparent; ";
  s += " postition: absolute; ";
  s += " left:-1px;top:0px;width:1px;height:1px; ";
  s += " } ";
  s += "#songtickerli .clear { ";
  s += " clear: both; ";
  s += " } ";
  s += this.station.get_style();
  s += this.platform.get_style();
  if (tickerstyle.styleSheet) { // IE
   tickerstyle.styleSheet.cssText = s;
  } else { // world
   tickerstyle.textContent  = s;
  }
  doc.appendChild(tickerstyle);

  tickerpopup = document.createElement('div');
  tickerpopup.className = 'songtickerli-ticker-info';
  tickerpopup.onmouseover = function() {
    tickerpopup.style.display = 'block';
  };
  tickerpopup.onmouseout = function() {
    tickerpopup.style.display = 'none';
  };
  infodiv = document.createElement('div');
  infodiv.className = 'songtickerli-ticker-info-overlay';
  infodiv.appendChild(this.platform.get_infodiv());
  infodiv.onmouseover = function() {
    tickerpopup.style.display = 'block';
  };
  tickerpopup.appendChild(infodiv);
  doc.appendChild(tickerpopup);

  tickertext = document.createElement('div');
  tickertext.className = 'songtickerli-ticker-right';
  tickertext.style.float = 'right';
  tickerlink = document.createElement('a');
  tickerlink.href = 'http://songticker.li';
  tickerlink.textContent = 'i';
  tickerlink.className = '.songtickerli-ticker-info-link';
  tickerlink.onclick = function() {
   if (tickerpopup.style.display == 'none') {
    tickerpopup.style.display = 'block';
   } else {
    tickerpopup.style.display = 'none';
   }
   return false;
  };
  tickertext.appendChild(tickerlink);
  headerdiv.appendChild(tickertext);
  doc.appendChild(headerdiv);

  stationpopup = document.createElement('div');
  stationpopup.className = 'songtickerli-station-info';
  infoframe = this.station.get_infopopup();
  infoframe.width = 221;
  infoframe.height = 65;
  stationpopup.appendChild(infoframe);
  stationpopup.station = station;
  stationpopup.frame = infoframe;
  stationpopup.onmouseover = function() {
    stationpopup.style.display = 'block';
  };
  stationpopup.onmouseout = function() {
    stationpopup.style.display = 'none';
  };
  doc.appendChild(stationpopup);

  stationtext = document.createElement('div');
  stationtext.className = 'songtickerli-ticker-left';
  stationlink = document.createElement('a');
  stationlink.href = this.station.url;
  stationlink.textContent = this.station.name;
  stationlink.onmouseover = function() {
    stationpopup.style.display = 'block';
    stationpopup.children[0].src = songtickerli.station.infopopup;
  };
  stationlink.onmouseout = function() {
    stationpopup.style.display = 'none';
  };
  stationtext.appendChild(stationlink);
  headerdiv.appendChild(stationtext);

  this.ticker = document.createElement('div');
  this.ticker.className = 'songtickerli-canvas';
  doc.appendChild(this.ticker);

  cleardiv = document.createElement('div');
  cleardiv.className = 'clear';
  doc.appendChild(cleardiv);
 };

 this.get_span_element = function(xml, options) {
  data = xml.getElementsByTagName(options.tagname);
  if (data[0])
   if (data[0].textContent)
     data = data[0].textContent;
   else
     data = data[0].text;
  else
   data = '';
  element = document.createElement('span');
  element.className = 'songtickerli-'+options.classname;
  element.textContent = data;
  return element;
 };

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


