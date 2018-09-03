import React from 'react';
import styles from './styles.scss';
import classnames from 'classnames';
import _ from 'lodash';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import { withStreams, withStreamProps, omitProps, composeHandler } from 'libs/hoc';
import { withItemWatcher, withItemImOrNothing, withItemItOrNothing, withItemIt } from 'libs/hoc/builder';
import { withRootItem, withRootItem$, withActiveItem } from 'libs/hoc/builder/item';

import * as itemBuilderEnhancers from 'libs/hoc/builder/item';
import * as layoutHandlers from 'containers/Layout/handlers';
import { withModel, withModelStream, withModelStreamProp } from 'libs/model/hoc';
import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Flex, Box } from 'reflexbox';
import { Set } from 'immutable';
import withProps from 'recompose/withProps';
import EditableText from 'components/EditableText';
import withPropsOnChange from 'recompose/withPropsOnChange';
import BoxModel from 'libs/editor/model/box';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { getRenderer, getConfigProps } from './ConfigSchema';
import AddProp from './components/AddProp'

export const BoxProps = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  branch(({ activeBoxIt }) => !activeBoxIt, renderNothing),
)(({ activeBoxIt }) => (
  <div className={styles.wrapper}>
    {
      getConfigProps().map(prop => {
        const Renderer = getRenderer(prop);
        const value = activeBoxIt.get(prop);
        return (
          <Renderer key={prop} prop={prop} value={value} boxIt={activeBoxIt} />
        )
      })
    }
    <AddProp modelIt={activeBoxIt} />
  </div>
));

export default BoxProps;
