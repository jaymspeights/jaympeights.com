$(function () {
   $('.project').each(function () {
      this.style.setProperty('--tilt-amt', 0+'deg');
   });
   $('.tuggable').each(function () {
      let obj = {$:this, center:null, rot:getRotation($(this))};
      $(this).on('mousedown', (e) => {
         let box = this.getBoundingClientRect();
         obj.center = {x:box.x+box.width/2, y:box.y+box.height/2};
         obj.offset = getOffset(this);	
		console.log(obj.offset);
         let x = e.clientX-obj.center.x; 
         let y = e.clientY-obj.center.y; 
         obj.rtc = Math.atan2(y, x);
         obj.magnitude = Math.hypot(x, y);
         dragging = obj;
      });
   });
   $(document).on('mousemove', (e) => {
      mouseX=e.clientX;
      mouseY=e.clientY;
   });
   $(document).on('mouseup', (e) => {
      dragging = null;
   });

});

function getOffset(elem) {
   let offset = {};
   if (elem.style.top==null || elem.style.top=='')
      if (elem.style.bottom==null || elem.style.bottom=='')
	offset.y = 0;
      else
         offset.y = +elem.style.bottom.replace('px','');
   else
      offset.y = +elem.style.top.replace('px','');
  
    if (elem.style.left==null || elem.style.left=='')
      if (elem.style.right==null || elem.style.right=='')
	offset.x = 0;
      else
         offset.x = +elem.style.right.replace('px','');
   else
      offset.x = +elem.style.left.replace('px','');
   
   return offset;
}

var dragging = null;
var mouseX = null;
var mouseY = null;

var MoI = .000001;
var mass = 100;
setInterval(function() {
   if (dragging != null) {
      let angle = Math.atan2(mouseY-dragging.center.y, mouseX-dragging.center.x) - dragging.rtc; 
      let tugX = dragging.center.x+dragging.magnitude*Math.cos(dragging.rtc); 
      let tugY = dragging.center.y+dragging.magnitude*Math.sin(dragging.rtc);
      let magnitude = Math.hypot(mouseX - tugX, mouseY - tugY); 
      let direction = Math.atan2(mouseY-tugY, mouseX-tugX);
      let radius = dragging.magnitude;
      let new_rot = Math.sin(angle)*MoI*radius*magnitude;
      let rot = 'rotate('+(dragging.rot+new_rot)+'rad)';
      dragging.rot += new_rot; 
      dragging.rtc += new_rot;

      let forceX = Math.cos(direction)*magnitude/mass;
      dragging.center.x += forceX;

      let forceY = Math.sin(direction)*magnitude/mass;
      dragging.center.y += forceY;

      dragging.$.style.webkitTransform = rot;
      dragging.$.style.mozTransform = rot;
      dragging.$.style.transform = rot; 
      dragging.$.style.left = dragging.offset.x + forceX + 'px';
      dragging.$.style.top = dragging.offset.y + forceY + 'px';
      dragging.offset.x += forceX;
      dragging.offset.y += forceY;
   }
}, 10);

function getRotation(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.atan2(b, a);
    } else { var angle = 0; }
    return (angle < 0) ? angle + Math.PI*2 : angle;
}
