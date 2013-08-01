/* Author: Michel Gotta

*/

jQuery(document).ready(function($, undefined) {
"use strict";

	var mainWidth = 0;
	var time = 3.0;
	var plattform;
	var canvas = document.getElementById("canvas");
	var miniCanvas = document.getElementById("track-bezier-canvas");
	var miniCanvasLinear = document.getElementById("track-linear-canvas");
	var ctx;
	var mctx;
	var $car = $('.car');
	
	if ($('html').hasClass('canvas') && $('html').hasClass('cssanimations')) {
		
		// check which plattform
		if ($.browser.webkit) {
			plattform = "webkit";
		} else if($.browser.mozilla) {
			plattform = "moz";
		}

		mainWidth = $('#curve-creator').width();

		// Bezier controls
		$('#bezier-control-1, #bezier-control-2').draggable({
			containment: '#curve-creator',
			drag: getPositionsAndDraw,
			stop: getPositionsAndDraw
		});

		// Time slider
		$('#slider').slider({
				value: time,
				min: .1,
				max: 10,
				step: .1,
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
					$car.removeClass('right');
					break;
				case "3":
					carToggleClass = 'light';
					break;
				default:
					carToggleClass = 'right';
			}
			$car.toggleClass(carToggleClass);
		});

		$('#animation-type-selector').change(function() {
			switch($(this).val()) {
				case "1": 
					$car.removeClass('wide');
					break;
			}
		});

		if (miniCanvasLinear.getContext) {
			var ctxl = miniCanvasLinear.getContext('2d');
			ctxl.strokeStyle = "#8AAAB2";
			ctxl.lineWidth	 = 2;
			ctxl.beginPath();
			ctxl.moveTo(0,40);
			ctxl.lineTo(40,0);
			ctxl.stroke();
			ctxl.closePath();
		}

		draw(mainWidth*0.75,mainWidth*0.75,mainWidth*0.25,mainWidth*0.25);
	} else {
		$('#container').html("");
		$('#warning').show();
	}

	function getPositionsAndDraw() {
		var e = $('#bezier-control-2').position();
		var o = $('#bezier-control-1').position();
		draw(o.left+16, o.top+16, e.left+16, e.top+16);
	}

	function drawLine(x, y, start) {
		ctx.strokeStyle = "#666"
		ctx.lineWidth = 6;
		
		ctx.beginPath();
		if (start) {
			ctx.moveTo(mainWidth, 0);
		} else {
			ctx.moveTo(0, mainWidth);
		}
		
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();
	}

	function drawBezier(target, pos, lineWidth, width) {
		target.strokeStyle = '#ed5e11';
		target.lineWidth = lineWidth;

		target.beginPath();
		target.moveTo(0, width); // Start bottom left
		target.bezierCurveTo(pos.x1, pos.y1, pos.x2, pos.y2, width , 0);
		target.stroke();
		target.closePath();
	}

	function draw(x1,y1,x2,y2) {
		if (canvas.getContext) {
			ctx = canvas.getContext("2d");
			canvas.width = canvas.width; // refresh hack

			// Draw lines on handle
			drawLine(x1, y1);
			drawLine(x2, y2, true);

			// Draw bezier
			drawBezier(ctx, {x1: x1, y1: y1, x2: x2, y2: y2}, 12, mainWidth);
		}
		
		// Draw on curve on mini canvas
		if (miniCanvas.getContext) {
			mctx = miniCanvas.getContext("2d");
			miniCanvas.width = miniCanvas.width; // refresh hack
			
			// Get bezier control coordinates for small canvas (x * width of canvas / width of big canvas)
			var pos = {
				x1: x1*40/mainWidth, 
				y1: y1*40/mainWidth, 
				x2: x2*40/mainWidth, 
				y2: y2*40/mainWidth
			};
			
			// Draw on small canvas
			drawBezier(mctx, pos, 2, 40);
		}

		// Make values CSS ready...
		x1 = x1/mainWidth;
		y1 = 1-y1/mainWidth;
		x2 = x2/mainWidth;
		y2 = 1-y2/mainWidth;

		var cssOutput = '-'+plattform+'-transition: all '+time.toFixed(1)+'s cubic-bezier(' + x1.toFixed(2) + ', ' + y1.toFixed(2) +', '+ x2.toFixed(2) + ', ' + y2.toFixed(2) + ')';

		// Build the copy&paste part
		$('#output').html(cssOutput);
		
		// Animate the cars
		$car.attr('style', cssOutput);
		$('.car-linear').attr('style', '-'+plattform+'-transition: all '+time+'s linear');
	}

});
