import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import { Boxing } from 'components/CSSStyleInspector';
import { withProps } from 'recompose';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Boxing', module)
  .add('with default props', 
    withProps({
      label: 'label',
      left: 'L',
      right: 'R',
      bottom: 'B',
      top: 'T',
    })((props) => <Boxing {...props} />))
;
