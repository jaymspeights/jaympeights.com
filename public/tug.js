window.onload = function () {
  let tugs = document.getElementsByClassName("tuggable");
  for (let elem of tugs) {
     tuggable(elem);
  }
  document.addEventListener('mousemove', (e) => {
     mouseX=e.clientX;
     mouseY=e.clientY;
  });
  document.addEventListener('mouseup', (e) => {
     dragging = null;
  });
  document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length < 1) return;
    e.stopPropagation();
     mouseX=e.touches[0].pageX;
     mouseY=e.touches[0].pageY;
  });
  document.addEventListener('touchend', (e) => {
    e.stopPropagation();
     dragging = null;
  });
}

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

var MoI = .0000003;
var mass = 30;
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
}, 30);

function getRotation(obj) {
    let style = window.getComputedStyle(obj);
    var matrix = style.webkitTransform ||
    style.mozTransform    ||
    style.msTransform     ||
    style.oTransform      ||
    style.transform;
    if(matrix !== 'none' && matrix !== '') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.atan2(b, a);
    } else { var angle = 0; }
    return (angle < 0) ? angle + Math.PI*2 : angle;
}

function tuggable(elem) {
  let obj = {$:elem, center:null, rot:getRotation(elem)};
  elem.addEventListener('mousedown', (e) => {
     let box = elem.getBoundingClientRect();
     obj.center = {x:box.x+box.width/2, y:box.y+box.height/2};
     obj.offset = getOffset(elem);
     let x = e.clientX-obj.center.x;
     let y = e.clientY-obj.center.y;
     obj.rtc = Math.atan2(y, x);
     obj.magnitude = Math.hypot(x, y);
     dragging = obj;
  });
  elem.addEventListener('touchstart', (e) => {
     e.stopPropagation();
     let box = elem.getBoundingClientRect();
     obj.center = {x:box.x+box.width/2, y:box.y+box.height/2};
     obj.offset = getOffset(elem);
     mouseX = e.touches[0].pageX;
     mouseY = e.touches[0].pageY;
     let x = e.touches[0].pageX-obj.center.x;
     let y = e.touches[0].pageY-obj.center.y;
     obj.rtc = Math.atan2(y, x);
     obj.magnitude = Math.hypot(x, y);
     dragging = obj;
  });
}
