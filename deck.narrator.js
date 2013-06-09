/*!
Deck JS - deck.narrator
Copyright (c) 2013 Kevin Lamping
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt
https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt

// TODO hook up with https://github.com/cgiffard/Captionator/
// TODO organize code a little bit better
// TODO add in unit/functional tests

*/

/*
This module adds a audio narration to slides
*/
(function($, deck, undefined) {
	var $d = $(document);

  /*
  Extends defaults/options.

  options.selectors.narratorAudio
    The element that matches this selector is the audio tag for the soundtrack
  */
  $.extend(true, $[deck].defaults, {
    selectors: {
      narratorAudio: '#narrator-audio'
    }
  });

  var audio,
      segments = [],
      segmentEnd = 0;

  function checkTime () {
      if (audio.currentTime >= segmentEnd) {
        audio.pause();
      }
  }

  function changeSlides (e, from, to) {
    if (audio) {
      audio.currentTime = segments[to][0];

      segmentEnd = segments[to][1];

      audio.play();
    }
  }

  function startSlides (ev) {
    $.deck('play');
  }

  function stopSlides (ev) {
    $.deck('pause');
  }

  function setInitialTime (ev) {
        audio.currentTime = segments[currentIndex][0];

        // remove event listener so this function doesn't get executed again
        this.removeEventListener('canplay',setInitialTime,false);
  }

  $d.bind('deck.init', function() {
    var opts = $.deck('getOptions');
    audio = $(opts.selectors.narratorAudio).get(0);

    // uncomment following line if not using deck.automatic.js
    //audio.addEventListener('timeupdate', checkTime, false);

    // Sync audio with slides
    audio.addEventListener('play', startSlides, false);
    audio.addEventListener('pause', stopSlides, false);

    // build audio stops
    var slides = $.deck('getSlides');
    var $currentSlide = $.deck('getSlide');
    var position = 0;
    var currentIndex = 0;

    $.each(slides, function(i, $el) {
      var duration = $el.data('narrator-duration');

      if ($currentSlide == $el) {
        currentIndex = i;
      }

      segments.push([position, position + duration]);
      position += duration;
    });

    // initialize first segment start and end
    audio.addEventListener('canplay', setInitialTime);
    segmentEnd = segments[currentIndex][1];
  })
  /* Update audio location, play till end of slide */
  .bind('deck.change', changeSlides);

})(jQuery, 'deck');








