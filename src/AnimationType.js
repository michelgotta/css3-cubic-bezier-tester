import React from 'react';

import AT from './constants/animationTypes';

class AnimationType extends React.PureComponent {
  render () {
    return (
      <select
        onChange={this.props.onChange}
        name='animation-type'
        id='animation-type-selector'
        size='1'
        value={this.props.value}
      >
        <option value={AT.POSITION}>Position</option>
        <option value={AT.SIZE}>Size</option>
        <option value={AT.OPACITY}>Opacity</option>
      </select>
    );
  }
}

export default AnimationType;
