/* Author: 

*/
var mainWidth = 0;
var time = 3.0;

$(function() {
  if ($('html').hasClass('canvas') && $('html').hasClass('cssanimations')) {
    mainWidth = $('#curve-creator').width();
  
    $('#bezier-control-1').draggable({
      containment: '#curve-creator',
      drag: function(event, ui) {
        o = $('#bezier-control-1').position();
        e = $('#bezier-control-2').position();
        draw(o.left+16, o.top+16, e.left+16, e.top+16);
      }
    });
  
    $('#bezier-control-2').draggable({
      containment:'#curve-creator',
      drag: function(event, ui) {
        e = $('#bezier-control-2').position();
        o = $('#bezier-control-1').position();
        draw(o.left+16, o.top+16, e.left+16, e.top+16);
      }
    });
  
    $('#slider').slider({
        value:time,
        min: 1,
        max: 10,
        step: 0.1,
        slide: function(event, ui) {
          time = ui.value;
          e = $('#bezier-control-2').position();
          o = $('#bezier-control-1').position();
          draw(o.left+16, o.top+16, e.left+16, e.top+16);
          $('#slider-wrapper .time').html(time);
        }
    });
  
    $('button').click(function() {
      $('.car').toggleClass('right');
    });
    var miniCanvas = document.getElementById("track-linear-canvas");
  
    if (miniCanvas.getContext) {
      var ctx = miniCanvas.getContext('2d');
      ctx.strokeStyle = "#8AAAB2";
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(0,40);
      ctx.lineTo(40,0);
      ctx.stroke();
      ctx.closePath();
    }
  
  
    draw(mainWidth*0.75,mainWidth*0.75,mainWidth*0.25,mainWidth*0.25);
  } else {
    $('#container').html("");
    $('#warning').show();
  }
});
function draw(x1,y1,x2,y2) {
  var canvas = document.getElementById("canvas");  
  var miniCanvas = document.getElementById("track-bezier-canvas");
  
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");  
    canvas.width = canvas.width;    
    ctx.strokeStyle = "#666";
    ctx.lineWidth   = 6;
    
    ctx.beginPath();  
    ctx.moveTo(0,mainWidth);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    ctx.closePath();  
    
    ctx.beginPath();  
    ctx.moveTo(mainWidth,0);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "#ed5e11";
    ctx.lineWidth   = 12;
    ctx.beginPath();
    ctx.moveTo(0,mainWidth);
    ctx.bezierCurveTo(x1,y1,x2,y2,mainWidth,0);
    ctx.stroke();
    ctx.closePath();
    

    
  }
  if (miniCanvas.getContext) {
    var mctx = miniCanvas.getContext("2d");
    miniCanvas.width = miniCanvas.width;
    mctx.strokeStyle = '#ed5e11';
    mctx.lineWidth   = 2;
    mctx.beginPath();
    mctx.moveTo(0,40);
    mctx.bezierCurveTo(x1*40/mainWidth,y1*40/mainWidth,x2*40/mainWidth,y2*40/mainWidth,40,0);
    mctx.stroke();
    mctx.closePath();
  }
  
  x1 = parseInt(x1/mainWidth*100)/100;
  y1 = 1-parseInt(y1/mainWidth*100)/100;
  x2 = parseInt(x2/mainWidth*100)/100;
  y2 = 1-parseInt(y2/mainWidth*100)/100;
  
  y1 = parseInt(y1*100)/100;
  y2 = parseInt(y2*100)/100;
  
  $('.car').attr('style', '-webkit-transition: all '+time+'s cubic-bezier(' + x1 + ',' + y1 +','+ x2 + ',' + y2 + ')');
  $('.car-linear').attr('style', '-webkit-transition: all '+time+'s linear');
  
  $('#output').html('-webkit-transition: all '+time+'s cubic-bezier(' + x1 + ', ' + y1 +', '+ x2 + ', ' + y2 + ')');
}