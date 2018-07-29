import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import { compose, withState } from 'recompose';
import { withComposedHandlers, useChangedProps } from 'libs/hoc';
import sStyles from './styles.scss';
import classnames from 'classnames';

export class ColorPicker extends React.Component {
  render() {
    const { color, onChange, displayColorPicker, onClose, onOpen } = this.props;
    const styles = reactCSS({
      'default': {
        color: {
          background: color,
        },
      },
    });

    return (
      <div>
        <div className={sStyles.swatch} onClick={onOpen}>
          <div style={ styles.color } className={sStyles.color} />
        </div>
        { displayColorPicker ?
          <div className={sStyles.popover} >
            <div className={sStyles.cover} onClick={onClose}/>
            <SketchPicker color={color} onChange={onChange} />
          </div> :
          null
        }

      </div>
    )
  }
}

export default compose(
  withState('stateColor', 'setColor', '#fff'),
  withState('displayColorPicker', 'setDisplayColorPicker', false),
  withComposedHandlers({
    onChange: ({ setColor }) => (color) => setColor(color.hex),
    onClose: ({ setDisplayColorPicker }) => () => setDisplayColorPicker(false),
    onOpen: ({ setDisplayColorPicker, displayColorPicker }) => () => setDisplayColorPicker(!displayColorPicker),
  }),
  useChangedProps(['color', 'stateColor']),
)(ColorPicker);
