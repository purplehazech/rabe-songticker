var songtickerli = {};
var _songtickerli_options;

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
   s  = ".rabe-songtickerli-infopopup-frame {\n ";
   s += " overflow: hide; ";
   s += "}\n ";
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
   div.textContent = 'Hol dir deinen Ticker auf: ';
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


 this.Tick = function () {
  try {
   if (typeof flensed != 'undefined') {
    flensed.flXHR.module_ready;
   } else {
    throw new Exception;
   }
  } catch(e) {
   setTimeout(function() {
    songtickerli.Tick();
   }, 10);
  }
  req = flensed.flXHR({
   appendToId: 'songtickerli',
   autoUpdatePlayer: false,
   instancePooling: true
  });
  req.onreadystatechange = function() {
   if (req.readyState == 4) {
    if (req.status == 200 || req.status == 304) {
     // hide timeoutmsg if shown
     songtickerli.Load(req.responseXML);
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

 this.Load = function(xml) {
  message = this.get_span_element(xml,{tagname: 'message', classname: 'message'});
  artist  = this.get_span_element(xml,{tagname: 'artist', classname: 'artist'});
  title   = this.get_span_element(xml,{tagname: 'title', classname: 'title'});

  if (title.textContent.length > 28) {
   title.textContent = title.textContent.substr(0,28)+"...";
  }

  this.ticker.innerHTML = '';
  this.ticker.appendChild(message);
  this.ticker.appendChild(title);
  this.ticker.appendChild(artist);

  setTimeout(function() {
   songtickerli.Tick();
  }, 10000);
 };

 this.initialize_tickergui = function () {
  doc = document.getElementById(this.options.elementid);

  headerdiv = document.createElement('div');
  headerdiv.className = 'songtickerli-header';

  flensedscript = document.createElement('script');
  flensedscript.type = 'text/javascript';
  flensedscript.src = this.options.baseurl+'/flensed/flXHR.js';
  flensedscript.style.display = 'none';
  doc.appendChild(flensedscript);

  tickerstyle = document.createElement('style');
  tickerstyle.type = 'text/css';
  s  = "#songtickerli {\n ";
  s += " border: 1px solid #303030; ";
  s += " background: "+this.station.background_color+"; ";
  s += " width: 223px; ";
  s += " padding-left: 62px; ";
  s += " padding-right: 2px; ";
  s += " background: url("+this.station.logo+") no-repeat scroll 2px 2px "+this.station.background_color+"; ";
  s += " -moz-border-radius: 6px; ";
  s += " -webkit-border-radius: 6px; ";
  s += " border-radius: 6px; ";
  s += " }\n ";
  s += ".songtickerli-canvas {\n ";
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
  s += " }\n ";
  s += ".songtickerli-message {\n ";
  s += " font-weight: bold; ";
  s += " text-transform: uppercase; ";
  s += " }\n ";
  s += ".songtickerli-title {\n ";
  s += " display: block; ";
  s += " font-weight: bold; ";
  s += " text-transform: uppercase; ";
  s += " }\n ";
  s += ".songtickerli-artist {\n ";
  s += " color: #505260; ";
  s += " }\n ";
  s += ".songtickerli-header {\n ";
  s += " font-size: 70%; ";
  s += " padding: 0.25em; ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " }\n ";
  s += ".songtickerli-ticker-right {\n ";
  s += " right: 2px; ";
  s += " float: right; ";
  s += " color: #00B3E6; ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " text-align: right; ";
  s += " }\n ";
  s += ".songtickerli-ticker-right {\n ";
  s += " background: transparent; ";
  s += " padding-bottom: 10px; ";
  s += " }\n ";
  s += ".songtickerli-ticker-left {\n ";
  s += " color: #00B3E6; ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " text-align: left; ";
  s += " }\n ";
  s += ".songtickerli-ticker-info {\n ";
  s += " background: transparent; ";
  s += " position: absolute; ";
  s += " margin-top: 0px; ";
  s += " width: 220px; ";
  s += " height: 70px; ";
  s += " display: none; ";
  s += " z-index: 6000;";
  s += " }\n ";
  s += ".songtickerli-ticker-info-link {\n ";
  s += " font-weight: bold; ";
  s += " font-size: 90%; ";
  s += "}\n ";
  s += ".songtickerli-ticker-info-overlay div {\n ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " color: "+this.station.foreground_color+"; ";
  s += "}\n ";
  s += ".songtickerli-ticker-info-overlay {\n ";
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
  s += " }\n ";
  s += ".songtickerli-station-info {\n ";
  s += " background-color: "+this.station.background_color+"; ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " position: absolute; ";
  s += " margin-top: -15px; ";
  s += " display: none; ";
  s += " -moz-border-radius: 6px; ";
  s += " -webkit-border-radius: 6px; ";
  s += " border-radius: 6px; ";
  s += " }\n ";
  s += ".songtickerli-station-info iframe {\n ";
  s += " border: 0; ";
  s += " overflow: hide; ";
  s += " background: transparent; ";
  s += " }\n ";
  s += "#songtickerli a {\n ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " text-decoration: none; ";
  s += " }\n ";
  s += "#songtickerli a:link, #songtickerli a:visited, #songtickerli a:active {\n ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " }\n ";
  s += "#songtickerli a:hover {\n ";
  s += " color: "+this.station.foreground_color+"; ";
  s += " text-decoration: underline; ";
  s += " }\n ";
  s += ".flXHRhideSwf {\n ";
  s += " display:block; ";
  s += " background: transparent; ";
  s += " postition: absolute; ";
  s += " left:-1px;top:0px;width:1px;height:1px; ";
  s += " }\n ";
  s += "#songtickerli .clear {\n ";
  s += " clear: both; ";
  s += " }\n ";
  tickerstyle.textContent  = s;
  tickerstyle.textContent += this.station.get_style();
  tickerstyle.textContent += this.platform.get_style();
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
  tickerlink.textContent = ' i ';
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
     data = data[0].textContent.substr(0,36);
   else
     data = data[0].text.substr(0,36);
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
