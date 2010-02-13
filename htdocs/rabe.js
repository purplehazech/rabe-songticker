var songtickerli = {};

function SongTicker_RaBe() {
 this.id = 'rabe.ch';
 this.path = '/data/rabe.ch/0.9.1/';
 this.type = 'xml';
}

function Songticker(station, options) {
 if (station == 'rabe.ch')
  this.station = new SongTicker_RaBe;
 else
  throw Exception('unknown station');

 this.Tick = function () {
  if (window.XMLHttpRequest) {
   req = new XMLHttpRequest();
   req.onreadystatechange = function() {
    if (req.readyState == 4) {
     if (req.status == 200 || req.status == 304) {
      // hide timeoutmsg if shown
      songtickerli.Load(req.responseXML);
     };
    };
   };
   req.ontimeout = function () {
    // show timeout msg here
    setTimeout("songtickerli.Tick()", 60000);
   }
   req.open('GET', this.station.path, true);
   req.send(null);
  };
 };

 this.Load = function(xml) {
  message = this.get_span_element(xml,{tagname: 'message', classname: 'message'});
  artist  = this.get_span_element(xml,{tagname: 'artist', classname: 'artist'});
  title   = this.get_span_element(xml,{tagname: 'title', classname: 'title'});

  doc = document.getElementById('songtickerli');
  doc.innerHTML = '';
  doc.appendChild(message);
  doc.appendChild(artist);
  doc.appendChild(title);

  setTimeout("songtickerli.Tick()", 10000);
 };

 this.get_span_element = function(xml, options) {
  data = xml.getElementsByTagName(options.tagname);
  if (data[0])
   data = data[0].textContent;
  else
   data = '';
  element = document.createElement('span');
  element.className = 'songtickerli-'+options.classname;
  element.textContent = data+' ';
  return element;
 };

 this.Tick();
};

function Songtickerli(station, options) {
  songtickerli = new Songticker(station);
};

Songtickerli('rabe.ch', {});

