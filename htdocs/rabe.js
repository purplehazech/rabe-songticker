var songtickerli = {};
var _songtickerli_options;
var flensed = {};

function SongTicker_Station_RaBe(options) {
 this.id = 'rabe.ch';
 this.path = options.baseurl+'/data/rabe.ch/0.9.1/';
 //this.path = options.baseurl+'/current.xml';
 this.type = 'xml';
 this.name = 'Radio RaBe 95.6 MHz';
 this.url  = 'http://www.rabe.ch';
 //this.infopopup = 'http://www.rabe.ch/songticker.html';
 this.infopopup = options.baseurl+'/testpopup.html?color='+options.colorscheme;

 if (typeof options.colorscheme == 'undefined') {
   options.colorscheme = 'green';
 }

 switch (options.colorscheme) {
   case 'red':
   	this.foreground_color = 'red';
	this.background_color = 'white';
	this.logo = '';
   case 'blue':
   case 'orange':
   case 'green':
   default:
     this.logo = 'data:image/png;base64,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';
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
   div.appendChild(document.createTextNode('Hol dir den Ticker für deine Homepage auf: '));

   link = document.createElement('a');
   link.href = 'http://songticker.li';
   link.target = '_parent';
   link.textContent = 'http://songticker.li';
   div.appendChild(link);

   outer = document.createElement('div');
   outer.style.padding = '0.5em';
   outer.appendChild(div);
   return outer;

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
  s += " font-family: 'bitstream vera sans','lucida grande',verdana,sans-serif;";
  s += " } ";
  s += ".songtickerli-canvas { ";
  s += " text-align: center; ";
  s += " margin-left: 2px; ";
  s += " width: 219px; ";
  s += " height: 43px; ";
  s += " background: url(data:image/gif;base64,R0lGODlh2wAxAPeDAOfm5+7u7e/u7uzs7N/e3uHg4fDv7+Lh4Xl9geXl5cjHyNfX19DQ0KSkpKKioufn58vLy6KhosXFxUhNVMzMzOPj48rKynd6fys1QJqamsLCwsnJyebm5kdOVqOjo9HR0efm5rKysuvr652cncvKyiEsODY/SE9VXNra2sfHx8zLzIWHicC/wMbGxqinqMjIyKenp1leY0xRWE5UXKCfoNTT0zI8Rk1TWUhOVqOkpJeXly44QlpfY2ZpbS84QoCAglJXXjA6RNjY2E5TWtLR0nd4evHx8Y6NjlRZYJ6dnkpQVoiIiWtucnp+gs3NzdPT08zLy87OztbW1j5GTiUwO6Oio6GhoXJ1elxgZTM7RdLS0pubm7a2tjtDTJaWl6GgoU1UWtnY2Z+en+jo6GBmbLi4uDpDTNTU1ISGiH1+f15jZ31+gCAsNyMvOq+vr2drcaSjo5+foN3c3eTk5N7d3eLi4unp6VBVXOHh4d3c3Nzc3O7t7tvb2+/v7+Dg4N/f393d3d7e3u7u7hwoNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAIMALAAAAADbADEAAAj/AAcNYpNlxpsLFxAoXMiwocOHECNKnEixosWLGDNq3FjxQhMyU3YIFEgFBxo3GsKgCMSypcuXMGPKnEmzps2bOHPq3Mmz500UZ1jEuWJCYIkTOfgYWMq0qdOnUKNKnUq1qtWrWLNq3cq1qwgNK3wM6uJFRJ+zaNOqXcu2rdu3cOPKnUu3rt27ePOidcKkRI8FegMLHky4sOHDeF2YWGIEsePHkCNLLkwBTBIBmDNr3sy5s+fPoEOLHk26tOnTqFOr5izkjgNBsGPLnk27tu3buHPr3s27t+/fwIMLp73gRoPhyJMrX868uXPhCyYcf069uvXr2JkvUDI9u/fv4MM//19wp8Ge8+jTq1/Pvr379/Djy59Pv779+/jzryffXbz//wAGGBt/AhZo4IHUEYjgggw2uBt/AUQo4YQUVmjhhRhmqOGGHHbo4YcghijiiBXyp9+JKKao4oostpgfeXAMIOOMNNZo44045qjjjjz26OOPQAYp5JBE2ijFHR7YoeSSTDbp5JNQRinllFRWaeWVWGap5ZZcOvkEkgCEKeaYZJZp5plopqnmmmy26eabcMYp55xlEnFHFXPkqeeefPbp55+ABirooIQWauihiCaq6KJ9MuBaHZBGKumklFZq6aWYZqrpppx26umnoIYqKqVRuPbHqaimquqqrLbq6quwxv8q66y01mrrrbjmuioFd0Sgx6/ABivssMQWa+yxyCar7LLMNuvss9BGO6wFd1jBx7XYZqvtttx26+234IYr7rjklmvuueimu+0Gvarr7rvwxivvvPSmy66v0uar77789uvvv9BSG0EeBBds8MEIJ6zwwgw37PDDEEcs8cQUV2wxwgJfrPHGHHfs8ccgW0xCr4CUbPLJKKes8sost+zyyzDHLPPMNNds880pj+wAzjz37PPPQAct9M0QuDb00UgnrfTSQRftAB1QRy311FRXbfXVWGet9dZcd+3112CHLTbVTvtk9tlop6322my3XXbbcMct99x0z130F3XnrffefOv/XfQIBAQu+OCEF2744YgnrvjijDfu+OOQRy755IVDcUcGumau+eacd+7557nyijnopJdu+umody66H6y37vrrsMcu++y012777bjnrvvuvPfuO+yOjvD78MQXb/zxyCfv+weuVaD889BHL/30x9dwxxZ2FKD99tx37/334Icv/vjkl2/++einr/767HOPxwdArMFBBXjUb//9+Oev//789+///wAMoAAHSMACGvCA9rNDCE6AhTLYgX4IjKAEJ0jBClrwggF8QB2OgAEMpOEFY3jgAUZIwhKa8IQoTKEKV8jCFrrwhTCMoQxnSMMZ2iEQMIiBQILwAwnwAQ8PSIAQlIdIxCIa8YhITKISl8jEJjrxiVCMohSnWEQOPOCKWHwACEBQBzlogQY8GMkgMKAGHYRAAwpIgQTWKIEWKOCNcIyjHOdIxzra8Y54zKMe98jHPvrxj35UAQMGSchBKoALYihCB8Q4kjaYAQl3GMIEJjkBGdzhkpjMpCY3yclOevKToAylKEdJylKa8pSo7GQHbMDIgAAAOw==) no-repeat scroll left top; ";
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
  s += " margin-top: -1px; ";
  s += " width: 220px; ";
  s += " height: 50px; ";
  s += " display: none; ";
  s += " z-index: 6000;";
  s += " } ";
  s += ".songtickerli-ticker-info > div { ";
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
  s += " opacity: 1;";
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
  tickerpopup.onclick = function() {
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
   tickerpopup.style.display = 'block';
   tickerlink.blur();
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
   data = data[0].textContent;
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


