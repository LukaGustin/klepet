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
      this.socket.emit('vzdevekSpremembaZahteva', vzdevek);
      break;
    case 'zasebno':
      besede.shift();
      var besedilo = besede.join(' ');
      var parametri = besedilo.split('\"');
      if (parametri) {
        this.socket.emit('sporocilo', { vzdevek: parametri[1], besedilo: parametri[3] });
        //alert(parametri[3]);
        if(parametri[3].indexOf("http") > -1) {
          if((parametri[3].indexOf("jpg") > -1) || (parametri[3].indexOf("png") > -1) || (parametri[3].indexOf("gif") > -1)) {
            var sporocilo2 = "<img src='" + parametri[3] + "' />"
            sporocilo = '(zasebno za ' + parametri[1] + '): ' + sporocilo2;  
          }
        } else {
          sporocilo = '(zasebno za ' + parametri[1] + '): ' + parametri[3];
        }
      } else {
        sporocilo = 'Neznan ukaz';
      }
      break;
    default:
      sporocilo = 'Neznan ukaz.';
      break;
  };

  return sporocilo;
};
