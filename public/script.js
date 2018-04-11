$(function () {
   $('.project').each(function () {
      this.style.setProperty('--tilt-amt', (Math.random()*5-2.5)+'deg');
   });
});
