import React from 'react';
import styles from './styles.scss';
import { compose, branch, renderNothing } from 'recompose';

import withModelStreamProp from 'gen/visoline/hoc/withModelStreamProp';
import BoxModel from 'gen/visoline/model/Box';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { getRenderer, getConfigProps } from 'libs/ConfigSchema';
import AddProp from 'gen/visoline/components/CONFIG_UI/components/AddProp'

export const BoxProps = compose(
  withModelStreamProp({ srcStream: ACTIVE_ITEM_STREAM, model: BoxModel, dstProp: 'activeBoxIt', watching: true }),
  branch(({ activeBoxIt }) => !activeBoxIt, renderNothing),
)(({ activeBoxIt }) => (
  <div className={styles.wrapper}>
    {
      getConfigProps(activeBoxIt).map(prop => {
        const Renderer = getRenderer(activeBoxIt, prop);
        const value = activeBoxIt.get(prop);
        return (
          <Renderer key={prop} prop={prop} value={value} model={activeBoxIt} />
        )
      })
    }
    <AddProp modelIt={activeBoxIt} />
  </div>
));

export default BoxProps;
