import React from 'react';
import styles from './styles.scss';
import storage from 'libs/storage';
import classnames from 'classnames';
import _ from 'lodash';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import { withStreams, withStreamProps } from 'libs/hoc';
import { withItemWatcher, withItemIm, withItemImOrNothing } from 'libs/hoc/builder';
import * as itemBuilderEnhancers from 'libs/hoc/builder/item';
import { ACTIVE_ITEM_STREAM } from 'libs/hoc/editor';
import { ROOT_ITEM_STREAM } from 'constants';
import * as layoutHandlers from 'containers/Layout/handlers';

import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Flex, Box } from 'reflexbox';
import { Set, fromJS } from 'immutable';
import withProps from 'recompose/withProps';
import EditableText from 'components/EditableText';
import withPropsOnChange from 'recompose/withPropsOnChange';
import loader from './loader';
import { getDirectory, getLoaderStore, addType, getMetaObject } from 'libs/loader';

const EXPANDED_NODES_STREAM = 'tree.expanded.nodes';
const SHOW_PAGE_LIST_STREAM = 'tree.pagelist.show';
const EDITOR_URL = 'http://localhost:3001';

const PrefixSpan = ({ children, className, ...rest }) => {
  return (
    <div className={classnames(styles.prefixSpan, className)} {...rest}>
      {children}
    </div>
  )
}

const ExpandIcon = compose(
  withStreams({ expandedNodes$: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withHandlers({
    onClick: ({ nodeId, expandedNodes$ }) => () => {
      let expandedNodes = expandedNodes$.get();
      if (expandedNodes.has(nodeId)) {
        expandedNodes = expandedNodes.delete(nodeId)
      } else {
        expandedNodes = expandedNodes.add(nodeId);
      }
      expandedNodes$.set(expandedNodes);
    },
  }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withProps(({ expandedNodes, nodeId }) => {
    return { expanded: expandedNodes.has(nodeId) };
  }),
)(({ onClick, className, expanded }) => {
  return (
    <div className={classnames(styles.expandIcon, className)} onClick={onClick}>
      {
        expanded ?
          <Icon className={classnames(styles.expandIcon, styles.muted)}>arrow_drop_down</Icon> :
          <Icon className={classnames(styles.expandIcon, styles.muted)}>arrow_right</Icon>
      }
    </div>
  )
});

const LEVEL_PREFIX_WIDTH = 24;
const LevelPrefix = ({ level }) => ( level ? <div style={{ flex: `0 0 ${level * LEVEL_PREFIX_WIDTH}px`}}/> : null)

const PanelSummary = compose(
  withState('expanded', 'setExpanded', false),
  withStreamProps({ activeNode: 'activeNode.stream' }),
  withStreams({ activeNode$: 'activeNode.stream' }),
  withProps(({ node, paths }) => ({
    name: paths[paths.length - 1],
    nodeId: paths.join('.'),
    isLeaf: !_.keys(node).length,
    level: paths.length,
  })),
  withProps(({ activeNode, nodeId }) => ({
    isActive: activeNode === nodeId,
  })),
  withHandlers({
    onClick: ({ activeNode$, nodeId }) => () => activeNode$.set(nodeId),
    toggleExpand: ({ setExpanded, expanded }) => () => setExpanded(!expanded),
    onSaveName: ({ itemIm }) => (name) => {
      if (itemIm) {
        itemIm.set('name', name).save();
      }
    },
    openInEditor: ({ paths }) => () => {
      const rest = _.take(paths, paths.length - 1);
      const filename = _.last(paths);
      const folder = rest.join('.');
      const endpointUrl = `${EDITOR_URL}/api/v1/ide/openTextSource?path=${folder}&name=${filename}`;
      fetch(endpointUrl)
        .then(() => console.log('ok'));
    },
  }),
  withItemWatcher(),
)(({ nodeId, isActive, level, onSaveName, onClick, openInEditor, name, isLeaf }) => {
  return (
    <Flex className={classnames(styles.panelSummary, { [styles.isActive]: isActive })} align="center">
      <LevelPrefix level={!isLeaf ? level : level + 1} />
      {
        !isLeaf ?
          <ExpandIcon nodeId={nodeId}/> :
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >crop_din</Icon></PrefixSpan>
      }
      { 
        !isLeaf ?
          <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >folder</Icon></PrefixSpan> :
          null
      }
      <Box className={classnames(styles.text)} onClick={onClick} auto>
        <EditableText value={name} onSave={onSaveName}/>
      </Box>
      <PrefixSpan className={classnames(styles.append)}><Icon className={classnames(styles.icon, styles.muted)}>lock</Icon></PrefixSpan>
      <PrefixSpan className={classnames(styles.append)} onClick={openInEditor}>
        <Icon className={classnames(styles.icon, styles.muted)}>edit</Icon>
      </PrefixSpan>
    </Flex>
  )
});


const NodeSelection = compose(
  withStreamProps({ activeNode: 'activeNode.stream' }),
  withStreams({ activeNode$: 'activeNode.stream' }),
  withProps(({ uid, paths }) => ({
    name: getLoaderStore().getIn([uid, 'name'], ''),
    nodeId: uid,
    level: paths.length,
    icon: 'crop_din',
  })),
  withProps(({ activeNode, nodeId }) => ({
    isActive: activeNode === nodeId,
  })),
  withHandlers({
    onClick: ({ activeNode$, nodeId }) => () => activeNode$.set(nodeId),
    onSaveName: ({ uid }) => (name) => {
      const nodeData = getLoaderStore().get(uid);
      getLoaderStore().setIn([uid, 'name'], name);
    },
    openInEditor: ({ uid }) => () => {
      const nodeData = getLoaderStore().get(uid);
      const filename = nodeData.get('entry', 'index');
      const ns = nodeData.get('ns');
      if(ns) {
        const endpointUrl = `${EDITOR_URL}/api/v1/ide/openTextSource`;
        fetch(endpointUrl, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            path: ns,
            name: filename
          }),
        });
      }
    },
  }),
)(({ nodeId, isActive, level, onSaveName, onClick, openInEditor, name, icon }) => {
  return (
    <Flex className={classnames(styles.panelSummary, { [styles.isActive]: isActive })} align="center">
      <LevelPrefix level={ level + 1} />
      <PrefixSpan><Icon className={classnames(styles.icon, styles.primary)} >{icon}</Icon></PrefixSpan>
      <Box className={classnames(styles.text)} onClick={onClick} auto>
        <EditableText value={name} onSave={onSaveName}/>
      </Box>
      <PrefixSpan className={classnames(styles.append)}><Icon className={classnames(styles.icon, styles.muted)}>lock</Icon></PrefixSpan>
      <PrefixSpan className={classnames(styles.append)} onClick={openInEditor}>
        <Icon className={classnames(styles.icon, styles.muted)}>edit</Icon>
      </PrefixSpan>
    </Flex>
  )
});

const NodeSelectionInfo = compose(
  withStreamProps({ nodeId: 'activeNode.stream' }),
  withProps(({ nodeId }) => ({
    nodeIm: getLoaderStore().get(nodeId)
  })),
  branch(({ nodeIm }) => !nodeIm, renderNothing),
)(
  ({ nodeIm }) => {
    return (
      <div>
        <div>Options</div>
        {
          nodeIm.map((value, key) => {
            return (
              <Flex key={key} className={classnames(styles.row, styles.kvRow)}>
                <Box w={0.4} className={styles.key}>{key}</Box>
                <Box w={0.6} className={styles.value}>{value}</Box>
              </Flex>
            )
          }).toList().toArray()
        }
      </div>
    )
  }
);

const ItemExplorer = compose(
)(({ node, paths }) => {
  return (
    <div className={styles.item}>
      <PanelSummary node={node} paths={paths}/>
    </div>
  )
});

const buildNodes = (acc, { node, paths = [], expandedNodes } ) => {
  const nodeId = paths.join('.');
  if (paths.length) {
    acc.push((
      <div key={nodeId} className={styles.node}>
        <ItemExplorer node={node} paths={paths} />
      </div>
    ))  
  }
  if (((expandedNodes.has(nodeId) || paths.length === 0))) {
    node.map((childNode, childName) => {
      if(typeof childName === 'symbol') {
        childNode.map(uid => {
          acc.push((
            <div key={uid} className={styles.node}>
              <NodeSelection uid={uid} paths={paths} />
            </div>
          ));
        })
      } else {
        buildNodes(acc, { node: childNode, expandedNodes, paths: [...paths, childName] });
      }
    });
  }
  return acc;
}

const PageSelection = compose(
  withItemImOrNothing,
  withStreamProps({
    rootItem: [ROOT_ITEM_STREAM],
  }),
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM, { init: null }],
  }),
  withHandlers({
    onClick: ({ rootItem$, item }) => () => rootItem$.set(item),
    onSaveName: ({ itemIm }) => (name) => {
      storage.updateItem(itemIm.set('name', name));
    },
  }),
  withItemWatcher(),
)(({ item, onClick, rootItem, onSaveName }) => {
  const activeRootIm = storage.getItem(rootItem);
  const itemIm = storage.getItem(item);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div className={classnames(styles.row, styles.rootItem, { [styles.isActive]: isActive })} onClick={onClick}>
      <EditableText value={itemIm.get('name', itemIm.get('id'))} onSave={onSaveName}/>
    </div>
  )
});


const Header = ({ children }) => (
  <Flex justify="space-between" className={classnames(styles.row, styles.header)}>
    {children}
  </Flex>
)

const PropsSelectorsPanel = compose(
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  branch(({ showPageList }) => !showPageList, renderNothing),
  itemBuilderEnhancers.withNewRootHandler('addPage'),
)(() => (
  <Header>
    <div>Enhancer Selector</div>
  </Header>
));

const updateMeta = (nsArr) => {
  if(nsArr.length) {
    const endpointUrl = `${EDITOR_URL}/api/v1/ide/updateMeta`;
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        ns: nsArr.join('.'),
        meta: getMetaObject(nsArr),
      }),
    });
  }
};

const ActivePagePanel = compose(
  itemBuilderEnhancers.withRootItemWatcher('item'),
  withItemImOrNothing,
  withStreams({
    showPageList$: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  withStreams({
    directory$: ['directory.stream', { init: getDirectory() }],
  }),
  withStreamProps({
    showPageList: [SHOW_PAGE_LIST_STREAM, { init: true }],
  }),
  withStreams({ activeNode$: 'activeNode.stream' }),
  withHandlers({
    togglePageList: ({ showPageList$ }) => () => showPageList$.set(!showPageList$.get()),
    doAdd: ({ activeNode$, directory$ }) => () => {
      const name = 'New';
      const activeNode = activeNode$.get();
      const ns = activeNode.split('.');
      directory$.set(addType(name, ns, 'enhancer'));

      // sync with server
      updateMeta(ns);
    },
    doAddFolder: ({ directory$, activeNode$ }) => () => {
      const name = 'New';
      const directory = directory$.get();
      const activeNode = activeNode$.get();
      directory$.set(directory.setIn([...activeNode.split('.'), name], fromJS({})));
    },
  })
)(({ itemIm, togglePageList, showPageList, doAdd, doAddFolder }) => {
  return (
    <Header>
      <Flex>
        <div onClick={doAdd}><Icon>add</Icon></div>
        <Icon>remove</Icon>
        <div onClick={doAddFolder}><Icon>folder_open</Icon></div>
      </Flex>
      <div onClick={togglePageList}>
        {
          !!showPageList ?
            <Icon>expand_less</Icon>:
            <Icon>expand_more</Icon>
        }
      </div>
    </Header>
  );
});

const ActivePageExplorer = compose(
  withStreamProps({
    item: [ROOT_ITEM_STREAM],
  }),
  withStreamProps({
    directory: ['directory.stream', { init: getDirectory() }],
  }),
  withItemImOrNothing,
  withStreams({
    rootItem$: [ROOT_ITEM_STREAM],
  }),
  withStreamProps({ expandedNodes: [EXPANDED_NODES_STREAM, { init: new Set() }] }),
  withItemWatcher(),
)(({ itemIm , rootItem, expandedNodes, className, directory }) => {
  console.log('rrrrrrrr', directory);
  const activeRootIm = storage.getItem(rootItem);
  const isActive = activeRootIm && activeRootIm.get('id') === itemIm.get('id');
  return (
    <div className={classnames(styles.container, className)} >
      {buildNodes([], { node: directory, expandedNodes } )}
    </div>    
  )
});

export const StorageExplorer = ({ children, ratio }) => (
  <div className={styles.wrapper}>
    <PropsSelectorsPanel />
    <ActivePagePanel />
    <ActivePageExplorer />
    <NodeSelectionInfo />
  </div>
);

export default StorageExplorer;
