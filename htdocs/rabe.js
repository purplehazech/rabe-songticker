var songtickerli = {};

function SongTicker_Station_RaBe(options) {
 this.id = 'rabe.ch';
 this.path = options.baseurl+'/data/rabe.ch/0.9.1/';
 this.type = 'xml';
 this.name = 'Radio RaBe 95.6 MHz';
 this.url  = 'http://www.rabe.ch';
 //this.infopopup = 'http://www.rabe.ch/songticker.html';
 this.infopopup = 'testpopup.html';

 if (typeof options.colorscheme == 'undefined') {
   options.colorscheme = 'green';
 }

 switch (options.colorscheme) {
   case 'red':
   case 'blue':
   case 'orange':
   case 'green':
   default:
     this.logo = options.baseurl+'/new/rabe_gruen.png';
     this.foreground_color = '#C4E218';
     this.background_color = '#1C2734';
   break;
 }

 this.get_style = function() {
   return "\
    .rabe-songtickerli-infopopup-frame {\
     overflow: hide;\
    }\n\
   ";
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
   return "\
   ";
 };

 this.get_infodiv = function() {
   div = document.createElement('div');
   link = document.createElement('a');
   link.href = 'href://songticker.li';
   link.target = '_parent';
   link.textContent = 'songticker.li';
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
   this.options.baseurl = 'http://songticker.li';
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
  if (window.XMLHttpRequest) {
   req = new XMLHttpRequest();
   req.onreadystatechange = function() {
    if (req.readyState == 4) {
     if (req.status == 200 || req.status == 304) {
      // hide timeoutmsg if shown
      songtickerli.Load(req.responseXML);
     }
    }
   };
   req.ontimeout = function () {
    // show timeout msg here
    setTimeout(function() {
    	songtickerli.Tick();
    }, 60000);
   };
   req.open('GET', this.station.path, true);
   req.send(null);
  }
 };

 this.Load = function(xml) {
  message = this.get_span_element(xml,{tagname: 'message', classname: 'message'});
  artist  = this.get_span_element(xml,{tagname: 'artist', classname: 'artist'});
  title   = this.get_span_element(xml,{tagname: 'title', classname: 'title'});

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

  tickerstyle = document.createElement('style');
  tickerstyle.textContent = "\
  #songtickerli {\
   border: 1px solid #303030;\
   background: "+this.station.background_color+";\
   width: 223px;\
   padding-left: 62px;\
   padding-right: 2px;\
   background: url("+this.station.logo+") no-repeat scroll 2px 2px "+this.station.background_color+";\
   -moz-border-radius: 6px;\
   -webkit-border-radius: 6px;\
   border-radius: 6px;\
  }\n\
  #songtickerli .songtickerli-canvas {\
   text-align: center;\
   margin-left: 2px;\
   width: 219px;\
   height: 43px;\
   background: url("+this.options.baseurl+"/new/bg_songticker.gif) no-repeat scroll left top;\
   color: #E7501E;\
   font-family: 'bitstream vera sans','lucida grande',verdana,sans-serif;\
   font-size: 10px;\
   padding-top: 9px;\
   padding-left: 3px;\
   padding-right: 6px;\
  }\n\
  #songtickerli .songtickerli-message {\
   font-weight: bold;\
   text-transform: uppercase;\
  }\n\
  #songtickerli .songtickerli-title {\
   display: block;\
   font-weight: bold;\
   text-transform: uppercase;\
  }\n\
  #songtickerli .songtickerli-artist {\
   color: #505260;\
  }\n\
  #songtickerli .songtickerli-header {\
   font-size: 70%;\
   padding: 0.25em;\
   background-color: "+this.station.background_color+";\
  }\n\
  #songtickerli .songtickerli-ticker-right {\
   right: 2px;\
   float: right;\
   color: #00B3E6;\
   background-color: "+this.station.background_color+";\
   text-align: right;\
  }\n\
  #songtickerli .songtickerli-ticker-right {\
   background: transparent;\
   padding-bottom: 10px;\
  }\n\
  #songtickerli .songtickerli-ticker-left {\
   color: #00B3E6;\
   background-color: "+this.station.background_color+";\
   text-align: left;\
  }\n\
  .songtickerli-ticker-info {\
   background: transparent;\
   position: absolute;\
   margin-top: 0px;\
   width: 220px;\
   height: 70px;\
   display: none;\
  }\n\
  .songtickerli-ticker-info-overlay {\
   background-color: "+this.station.background_color+";\
   position: absolute;\
   margin-top: 20px;\
   margin-left: 1px;\
   width: 220px;\
   height: 50px;\
   -moz-border-radius: 6px;\
   -webkit-border-radius: 6px;\
   border-radius: 6px;\
  }\n\
  .songtickerli-station-info {\
   background-color: "+this.station.background_color+";\
   color: "+this.station.foreground_color+";\
   position: absolute;\
   margin-top: -20px;\
   display: none;\
   -moz-border-radius: 6px;\
   -webkit-border-radius: 6px;\
   border-radius: 6px;\
  }\n\
  .songtickerli-station-info iframe {\
   border: 0;\
   overflow: hide;\
   background: transparent;\
  }\n\
  #songtickerli a {\
   color: "+this.station.foreground_color+";\
   text-decoration: none;\
  }\n\
  #songtickerli a:link, #songtickerli a:visited, #songtickerli a:active {\
   color: "+this.station.foreground_color+";\
  }\n\
  #songtickerli a:hover {\
   color: "+this.station.foreground_color+";\
   text-decoration: underline;\
  }\n\
  #songtickerli .clear {\
   clear: both;\
  }\n\
  ";
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
  tickerlink.textContent = 'songticker.li';
  tickerlink.onmouseover = function() {
    tickerpopup.style.display = 'block';
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
    stationpopup.children[0].src = 'testpopup.html';
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
 this.Tick();
};

function Songtickerli(station, options) {
  songtickerli = new Songticker(station, options);
};
