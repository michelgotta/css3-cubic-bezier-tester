import React, { Component } from 'react';
import Draggable from 'react-draggable';
import './App.css';

import AnimationType from './AnimationType';
import Slider from './Slider';
import Footer from './Footer';

import AT from './constants/animationTypes';

class App extends Component {
  constructor () {
    super();
    this.state = {
      animationType: AT.POSITION,
      time: 3.0,
      carToggleClass: '',
      'bezier-control-1': {
        x: 209,
        y: 209
      },
      'bezier-control-2': {
        x: 60,
        y: 59
      }
    };

    this.curveCreatorWidth = 300;

    this.handleAnimationTypeChange = this.handleAnimationTypeChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.canvas = React.createRef();
    this.miniCanvas = React.createRef();
    this.miniCanvasLinear = React.createRef();
  }

  componentDidMount () {
    if (this.miniCanvasLinear.current.getContext) {
      let ctxl = this.miniCanvasLinear.current.getContext('2d');
      ctxl.strokeStyle = '#aaaaaa';
      ctxl.lineWidth = 2;
      ctxl.beginPath();
      ctxl.moveTo(0, 40);
      ctxl.lineTo(40, 0);
      ctxl.stroke();
      ctxl.closePath();
    }

    const mainWidth = this.curveCreatorWidth;

    this.draw(mainWidth * 0.75, mainWidth * 0.75, mainWidth * 0.25, mainWidth * 0.25);
  }

  drawLine (x, y, start) {
    if (this.canvas.current.getContext) {
      const ctx = this.canvas.current.getContext('2d');
      const mainWidth = this.curveCreatorWidth;

      ctx.strokeStyle = '#666';
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
  }

  drawBezier (target, pos, lineWidth, width) {
    target.strokeStyle = '#333333';
    target.lineWidth = lineWidth;

    target.beginPath();
    target.moveTo(0, width); // Start bottom left
    target.bezierCurveTo(pos.x1, pos.y1, pos.x2, pos.y2, width, 0);
    target.stroke();
    target.closePath();
  }

  draw (x1, y1, x2, y2) {
    const mainWidth = this.curveCreatorWidth;
    if (this.canvas.current.getContext) {
      const ctx = this.canvas.current.getContext('2d');
      this.canvas.current.width = this.canvas.current.width; // refresh hack

      // Draw lines on handle
      this.drawLine(x1, y1);
      this.drawLine(x2, y2, true);

      // Draw bezier
      this.drawBezier(ctx, {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      }, 12, mainWidth);
    }

    // Draw on curve on mini canvas
    if (this.miniCanvas.current.getContext) {
      const mctx = this.miniCanvas.current.getContext('2d');
      this.miniCanvas.current.width = this.miniCanvas.current.width; // refresh hack

      // Get bezier control coordinates for small canvas (x * width of canvas / width of big canvas)
      const smallWidth = 40;
      let pos = {
        x1: x1 * smallWidth / mainWidth,
        y1: y1 * smallWidth / mainWidth,
        x2: x2 * smallWidth / mainWidth,
        y2: y2 * smallWidth / mainWidth
      };

      // Draw on small canvas
      this.drawBezier(mctx, pos, 2, smallWidth);
    }

    // Make values CSS ready...
    x1 = x1 / mainWidth;
    y1 = 1 - y1 / mainWidth;
    x2 = x2 / mainWidth;
    y2 = 1 - y2 / mainWidth;

    // transitionPrefixed = Modernizr.prefixed('transition').replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    const cssOutput = {transition: 'all ' + parseFloat(this.state.time).toFixed(1) + 's cubic-bezier(' + x1.toFixed(2) + ', ' + y1.toFixed(2) + ', ' + x2.toFixed(2) + ', ' + y2.toFixed(2) + ')'};

    const cssOutputLinear = {transition: 'all ' + this.state.time + 's linear'};

    this.setState({
      cssOutput: cssOutput,
      cssOutputLinear: cssOutputLinear
    });
  }

  handleAnimationTypeChange (event) {
    this.setState({
      carToggleClass: '',
      animationType: event.target.value
    });
  }

  handleSliderChange (event) {
    this.setState({
      time: event.target.value
    }, () => {
      this.getPositionsAndDraw();
    });
  }

  handleButtonClick () {
    let carToggleClass;
    if (this.state.carToggleClass === '') {
      switch (this.state.animationType) {
        case AT.POSITION:
          carToggleClass = 'right';
          break;
        case AT.SIZE:
          carToggleClass = 'wide';
          break;
        case AT.OPACITY:
          carToggleClass = 'light';
          break;
        default:
          carToggleClass = 'right';
      }
    } else {
      carToggleClass = '';
    }

    this.setState({
      carToggleClass: carToggleClass
    });
  }

  handleDrag (event, data) {
    this.setState({
      [data.node.id]: {
        x: data.x,
        y: data.y
      }
    });

    this.getPositionsAndDraw();
  }

  getPositionsAndDraw () {
    var e = this.state['bezier-control-2'];
    var o = this.state['bezier-control-1'];
    var d = 16;
    this.draw(o.x + d, o.y + d, e.x + d, e.y + d);
  }

  render () {
    return (
      <div id='container'>
        <header>
          <h1>CSS3 Bezier Curve Tester</h1>
        </header>
        <div id='main' role='main' className='clearfix'>
          <code id='output'>
            {this.state.cssOutput &&
              <span>
                transition: {this.state.cssOutput.transition}
              </span>
            }
          </code>
          <div id='curve-creator'>
            <canvas
              id='canvas'
              width='300'
              height='300'
              ref={this.canvas}
            />
            <Draggable
              bounds='parent'
              onDrag={this.handleDrag}
              defaultPosition={this.state['bezier-control-1']}
            >
              <div
                className='bezier-control'
                id='bezier-control-1'
              >
                <div className='center' />
              </div>
            </Draggable>
            <Draggable
              bounds='parent'
              onDrag={this.handleDrag}
              defaultPosition={this.state['bezier-control-2']}
            >
              <div
                className='bezier-control'
                id='bezier-control-2'
              >
                <div className='center' />
              </div>
            </Draggable>
          </div>
          <div id='settings'>
            <div id='slider-wrapper'>
              <h2>Time: <span className='time'>{parseFloat(this.state.time).toFixed(1)}</span>s</h2>
              <div id='slider'>
                <Slider
                  onChange={this.handleSliderChange}
                  value={this.state.time}
                />
              </div>

            </div>
            <div id='animation-tracks'>
              <div id='track-bezier'>
                <h3>Bezier</h3>
                <canvas
                  id='track-bezier-canvas'
                  width='40'
                  height='40'
                  ref={this.miniCanvas}
                />
                <div className='track'>
                  <div
                    className={'car ' + this.state.carToggleClass}
                    style={this.state.cssOutput}
                  />
                </div>
              </div>
              <div id='track-linear'>
                <h3>Linear</h3>
                <canvas
                  id='track-linear-canvas'
                  width='40'
                  height='40'
                  ref={this.miniCanvasLinear}
                />
                <div className='track'>
                  <div
                    className={'car car-linear ' + this.state.carToggleClass}
                    style={this.state.cssOutputLinear}
                  />
                </div>
              </div>
              <AnimationType
                onChange={this.handleAnimationTypeChange}
                value={this.state.animationType}
              />
            </div>
            <button
              onClick={this.handleButtonClick}
              id='run'
            >
                Start Animation
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
