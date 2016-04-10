var Klepet = function(socket) {
  this.socket = socket;
};

Klepet.prototype.posljiSporocilo = function(kanal, besedilo) {
  var sporocilo = {
    kanal: kanal,
    besedilo: besedilo
  };
  this.socket.emit('sporocilo', sporocilo);
};

Klepet.prototype.spremeniKanal = function(kanal) {
  this.socket.emit('pridruzitevZahteva', {
    novKanal: kanal
  });
};

Klepet.prototype.procesirajUkaz = function(ukaz) {
  var besede = ukaz.split(' ');
  ukaz = besede[0].substring(1, besede[0].length).toLowerCase();
  var sporocilo = false;

  switch(ukaz) {
    case 'pridruzitev':
      besede.shift();
      var kanal = besede.join(' ');
      this.spremeniKanal(kanal);
      break;
    case 'vzdevek':
      besede.shift();
      var vzdevek = besede.join(' ');
      //alert(vzdevek);
      this.socket.emit('vzdevekSpremembaZahteva', vzdevek);
      break;
    case 'zasebno':
      besede.shift();
      var besedilo = besede.join(' ');
      var parametri = besedilo.split('\"');
      if (parametri) {
        this.socket.emit('sporocilo', { vzdevek: parametri[1], besedilo: parametri[3] });
//<<<<<<< HEAD
        //alert(parametri[3]);
        if(parametri[3].indexOf("http") > -1) {
          if((parametri[3].indexOf("jpg") > -1) || (parametri[3].indexOf("png") > -1) || (parametri[3].indexOf("gif") > -1)) {
            var sporocilo2 = "<img src='" + parametri[3] + "' />"
            sporocilo = '(zasebno za ' + parametri[1] + '): ' + sporocilo2;
            return sporocilo;
          } else if(parametri[3].indexOf('youtube') > -1) {
          var video = parametri[3];
          var res = video.split('=');
          var sporocilo3 = "<iframe src=" + '"' + "https://www.youtube.com/embed/" + res[1] + '"' + "allowfullscreen" + "></iframe>";
          sporocilo = '(zasebno za ' + parametri[1] + '): ' + sporocilo3;
          return sporocilo;
//>>>>>>> youtube
        } else {
          sporocilo = '(zasebno za ' + parametri[1] + '): ' + parametri[3];
        }
      } else {
        sporocilo = 'Neznan ukaz';
      }
      }
      break;
    case 'dregljaj':
      besede.shift();
      var prejemnik = besede.join(' ');
      //alert(vzdevek); 
      this.socket.emit('dregljaj',  {vzdevek: prejemnik});
      
      break;
    default:
      sporocilo = 'Neznan ukaz.';
      break;
    };

  return sporocilo;
};
