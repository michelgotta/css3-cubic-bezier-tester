/* Author: Michel Gotta

*/
var mainWidth = 0;
var time = 3.0;
var plattform;

$(function() {
	if ($('html').hasClass('canvas') && $('html').hasClass('cssanimations')) {

		if ($.browser.webkit) {
			plattform = "webkit";
		} else if($.browser.mozilla) {
			plattform = "moz";
		}

		mainWidth = $('#curve-creator').width();

		$('#bezier-control-1').draggable({
			containment: '#curve-creator',
			drag: getPositionsAndDraw,
			stop: getPositionsAndDraw
		});

		$('#bezier-control-2').draggable({
			containment:'#curve-creator',
			drag: getPositionsAndDraw,
			stop: getPositionsAndDraw
		});

		$('#slider').slider({
				value:time,
				min: 1,
				max: 10,
				step: 0.1,
				slide: function(event, ui) {
					time = ui.value;
					getPositionsAndDraw();
					$('#slider-wrapper .time').html(time.toFixed(1));
				}
		});

		$('button').click(function() {
			var carToggleClass;
			switch($('#animation-type-selector').val()) {
				case "1":
					carToggleClass = 'right';
					break;
				case "2":
					carToggleClass = 'wide';
					$('.car').removeClass('right');
					break;
				case "3":
					carToggleClass = 'light';
					break;
				default:
					carToggleClass = 'right';
			}
			$('.car').toggleClass(carToggleClass);
		});

		$('#animation-type-selector').change(function() {
			switch($(this).val()) {
				case "1": 
					$('.car').removeClass('wide');
					break;
			}
		});

		var miniCanvas = document.getElementById("track-linear-canvas");

		if (miniCanvas.getContext) {
			var ctx = miniCanvas.getContext('2d');
			ctx.strokeStyle = "#8AAAB2";
			ctx.lineWidth	 = 2;
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
function getPositionsAndDraw() {
	e = $('#bezier-control-2').position();
	o = $('#bezier-control-1').position();
	draw(o.left+16, o.top+16, e.left+16, e.top+16);
}
function draw(x1,y1,x2,y2) {
	var canvas = document.getElementById("canvas");
	var miniCanvas = document.getElementById("track-bezier-canvas");

	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		canvas.width = canvas.width;
		ctx.strokeStyle = "#666";
		ctx.lineWidth	 = 6;

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
		ctx.lineWidth	 = 12;
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
		mctx.lineWidth	 = 2;
		mctx.beginPath();
		mctx.moveTo(0,40);
		mctx.bezierCurveTo(x1*40/mainWidth,y1*40/mainWidth,x2*40/mainWidth,y2*40/mainWidth,40,0);
		mctx.stroke();
		mctx.closePath();
	}

	x1 = x1/mainWidth;
	y1 = 1-y1/mainWidth;
	x2 = x2/mainWidth;
	y2 = 1-y2/mainWidth;

	$('.car').attr('style', '-'+plattform+'-transition: all '+time.toFixed(1)+'s cubic-bezier(' + x1 + ',' + y1 +','+ x2 + ',' + y2 + ')');
	$('.car-linear').attr('style', '-'+plattform+'-transition: all '+time+'s linear');

	$('#output').html('-'+plattform+'-transition: all '+time.toFixed(1)+'s cubic-bezier(' + x1.toFixed(2) + ', ' + y1.toFixed(2) +', '+ x2.toFixed(2) + ', ' + y2.toFixed(2) + ')');
}