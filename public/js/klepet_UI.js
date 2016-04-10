function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
//<<<<<<< HEAD
  var jeVideo = sporocilo.indexOf('youtube') > -1;
  var jeSlika = sporocilo.indexOf('<img') > -1;
  var jeZasebno = sporocilo.indexOf('zasebno') > -1;
  if (jeZasebno && jeSlika && !jeSmesko) {
    var sporocilo2 = sporocilo;
    res = sporocilo2.split(' ')
    var sli = res[0] + " " + res[1] + " " + "<img src='" + res[2] + "' />";
    return $('<div style="font-weight: bold"></div>').html(sli); 
  }
  if(jeSlika && !jeSmesko) {
    //alert("Slika");
    //sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);  
  }
  
//=======
  var jeVideo = sporocilo.indexOf('youtube') > -1;
  var jeZasebno = sporocilo.indexOf('zasebno') > -1;
  if (jeVideo) {
    var video = sporocilo;
    var posiljatelj = sporocilo;
    var res1 = posiljatelj.split(" ", 1);
    var res = video.split("=");
    var sporocilo4;
    var zasebnivideo= sporocilo;
    if (jeZasebno) {
      var res2 = zasebnivideo.split(' ');
      sporocilo = res2[0] + " " + res2[1] + "<iframe src=" + '"' + "https://www.youtube.com/embed/" + res[1] + '"' + "allowfullscreen" + "></iframe>";
      return $('<div style="font-weight: bold"></div>').html(sporocilo);   
    } else if (!(res1[0].indexOf('youtube') > -1)) {
      sporocilo4 = res1[0] + "<iframe src=" + '"' + "https://www.youtube.com/embed/" + res[1] + '"' + "allowfullscreen" + "></iframe>";
    } else {
      sporocilo4 = "<iframe src=" + '"' + "https://www.youtube.com/embed/" + res[1] + '"' + "allowfullscreen" + "></iframe>";
    }
    return $('<div style="font-weight: bold"></div>').html(sporocilo4);
  } else if(sporocilo.indexOf("Neznan") > -1 || sporocilo.indexOf("Dregljaj") > -1) {
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  } else if (jeSmesko) {
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
  } else {
    return $('<div style="font-weight: bold;"></div>').text(sporocilo);
  }

}

function divElementHtmlTekst(sporocilo) {
  return $('<div></div>').html('<i>' + sporocilo + '</i>');
}

var slika=false;

function procesirajVnosUporabnika(klepetApp, socket) {
  var sporocilo = $('#poslji-sporocilo').val();
  sporocilo = dodajSmeske(sporocilo);
  var sistemskoSporocilo;
//<<<<<<< HEAD
//=======
  var jeVideo = sporocilo.indexOf('youtube') > -1;
 
//>>>>>>> youtube
  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);
    if (sistemskoSporocilo) {
      $('#sporocila').append(divElementHtmlTekst(sistemskoSporocilo));
    } 
  } else if ((sporocilo.indexOf("http://") > -1) || (sporocilo.indexOf("https://") > -1) && !jeVideo) {
    if((sporocilo.indexOf(".jpg")>-1)|| (sporocilo.endsWith(".png")>-1) || (sporocilo.endsWith(".gif")>-1)) {
      //klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
      //$('#sporocila').append(divElementEnostavniTekst(sporocilo));
      var stil = "width:200px; margin-left:20px;"
      sporocilo2 = "<img src='" + sporocilo + "'" + "style=" + stil + " />";
      slika=true;
      //sporocilo= "<div>"+ "<i>" +sporocilo2+ "</i>" + "</div>";
      klepetApp.posljiSporocilo(trenutniKanal, sporocilo2);
      $('#sporocila').append(divElementHtmlTekst(sporocilo2));
      $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
    } else {
      klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
      $('#sporocila').append(divElementEnostavniTekst(sporocilo));
    }
  } else {
    sporocilo = filtirirajVulgarneBesede(sporocilo);
    klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
    $('#sporocila').append(divElementEnostavniTekst(sporocilo));
    $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
  }

  $('#poslji-sporocilo').val('');
}

var socket = io.connect();
var trenutniVzdevek = "", trenutniKanal = "";

var vulgarneBesede = [];
$.get('/swearWords.txt', function(podatki) {
  vulgarneBesede = podatki.split('\r\n');
});

function filtirirajVulgarneBesede(vhod) {
  for (var i in vulgarneBesede) {
    vhod = vhod.replace(new RegExp('\\b' + vulgarneBesede[i] + '\\b', 'gi'), function() {
      var zamenjava = "";
      for (var j=0; j < vulgarneBesede[i].length; j++)
        zamenjava = zamenjava + "*";
      return zamenjava;
    });
  }
  return vhod;
}

$(document).ready(function() {
  var klepetApp = new Klepet(socket);

  socket.on('vzdevekSpremembaOdgovor', function(rezultat) {
    var sporocilo;
    if (rezultat.uspesno) {
      trenutniVzdevek = rezultat.vzdevek;
      $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
      sporocilo = 'Prijavljen si kot ' + rezultat.vzdevek + '.';
    } else {
      sporocilo = rezultat.sporocilo;
    }
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  });

  socket.on('pridruzitevOdgovor', function(rezultat) {
    trenutniKanal = rezultat.kanal;
    $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
    $('#sporocila').append(divElementHtmlTekst('Sprememba kanala.'));
  });

  socket.on('sporocilo', function (sporocilo) {
     //alert(sporcilo.besedilo);
     console.log(sporocilo.besedilo);
     var neki = sporocilo.besedilo;
     //var novElement = divElementHtmlTekst(sporocilo.besedilo);
     var novElement = divElementEnostavniTekst(sporocilo.besedilo);
    $('#sporocila').append(novElement);
  });
  
  socket.on('dregljaj', function(dregljaj){
    //alert("der");
    $('#vsebina').jrumble();
    $('#vsebina').trigger('startRumble');
    setTimeout(stop(), 1500);
    //$('#vsebina').trigger('stopRumble');
  });
  
  function stop() {
    $('#vsebina').trigger('stopRumble');    
  }
  
  socket.on('kanali', function(kanali) {
    $('#seznam-kanalov').empty();

    for(var kanal in kanali) {
      kanal = kanal.substring(1, kanal.length);
      if (kanal != '') {
        $('#seznam-kanalov').append(divElementEnostavniTekst(kanal));
      }
    }

    $('#seznam-kanalov div').click(function() {
      klepetApp.procesirajUkaz('/pridruzitev ' + $(this).text());
      $('#poslji-sporocilo').focus();
    });
  });
  
  //socket.on('obdelajDregljaj')

  socket.on('uporabniki', function(uporabniki) {
    $('#seznam-uporabnikov').empty();
    for (var i=0; i < uporabniki.length; i++) {
      $('#seznam-uporabnikov').append(divElementEnostavniTekst(uporabniki[i]));
    }
    
    $('#seznam-uporabnikov div').click(function() {
      //klepetApp.procesirajUkaz('/zasebno ' + $(this).text());
      $('#poslji-sporocilo').val('/zasebno ' + '"'+$(this).text()+ '"' + ' ').focus();
    });
  });

  setInterval(function() {
    socket.emit('kanali');
    socket.emit('uporabniki', {kanal: trenutniKanal});
  }, 1000);

  $('#poslji-sporocilo').focus();

  $('#poslji-obrazec').submit(function() {
    procesirajVnosUporabnika(klepetApp, socket);
    return false;
  });
  
  
  
});

/*jQuery(document).ready(function() {
  var KlepetApp= new Klepet(socket);
  socket.on('dregljaj', function(dregljaj){
    alert("der");
    jQuery('#vsebina').jrumble();
    jQuery('#vsebina').trigger('startRumble');
    //setTimeout(stop(), 1500);
    //$('#vsebina').trigger('stopRumble');
  });
  
});*/

function dodajSmeske(vhodnoBesedilo) {
  var preslikovalnaTabela = {
    ";)": "wink.png",
    ":)": "smiley.png",
    "(y)": "like.png",
    ":*": "kiss.png",
    ":(": "sad.png"
  }
  for (var smesko in preslikovalnaTabela) {
    vhodnoBesedilo = vhodnoBesedilo.replace(smesko,
      "<img src='http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko] + "' />");
  }
  return vhodnoBesedilo;
}
