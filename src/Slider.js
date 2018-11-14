import React from 'react';

class Slider extends React.PureComponent {
  render () {
    return (
      <input
        type='range'
        onChange={this.props.onChange}
        min='0.1'
        max='10'
        value={this.props.value}
        step='0.1'
        style={{width: '100%'}}
      />
    );
  }
}

export default Slider;
