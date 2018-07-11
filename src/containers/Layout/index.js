import React from 'react';
import styles from './styles.css';
import classnames from 'classnames';
import * as Components from 'reflexbox';
import { compose, withHandlers } from 'recompose';
import { withStreamProps, withStreams, getStream } from 'libs/hoc';
import { List } from 'immutable';

const { Flex, Box } = Components;
export const Layout = ({ data, doPush, doInsert }) => {
  return (
    <div  className={classnames(styles.container)}>
      <Flex>
        {buildItems(data)}
      </Flex>
      <Flex className={styles.actions} justify="space-between">
        <Box className={styles.btn} onClick={() => doPush(DEFAULT_BOX)}>Push</Box>
        <Box className={styles.btn} onClick={() => doInsert(DEFAULT_BOX)}>Insert</Box>
      </Flex>
    </div>
  );
}

const onClick = (index) => () => {
  console.log('inidex', index);
  getStream(ACTIVE_ITEM_STREAM).set(index);
};

const buildItems = (items) => {
  return items.map((item, index) => {
    const { type, children, ...rest } = item;
    const Com = Components[type];
    let subItems;
    if(children && children.size) {
      subItems = buildItems(children);
    }
    if(subItems) {
      return <Com {...rest} key={index} onClick={onClick(index)} >{subItems}</Com>
    }
    return <Com {...rest} key={index} onClick={onClick(index)} />
  })
}


const DEFAULT_BOX = {
  type: 'Box',
  className: classnames(styles.box),
  text: 'abox',
  children: List([]),
};
const initData = List([DEFAULT_BOX]);
const DATA_STREAM = 'data.stream';
const ACTIVE_ITEM_STREAM = 'activeItem.stream';

export default compose(
  withStreamProps({
    data: [DATA_STREAM, { init: initData }],
  }),
  withStreams({
    data$: DATA_STREAM,
    activeItem$: [ACTIVE_ITEM_STREAM, { init: 0 }],
  }),
  withHandlers({
    doPush: ({ data$ }) => () => {
      const newData = data$.get().push(DEFAULT_BOX);
      data$.set(newData);
    },
    doInsert: ({ data$, activeItem$ }) => () => {
      const activeItemId = activeItem$.get() || 0;
      const oldData = data$.get()
      let activeItem = oldData.get(activeItemId);
      data$.set(oldData.set(activeItemId, {...activeItem, children: activeItem.children.push(DEFAULT_BOX)}))
    }

  })
)(Layout);