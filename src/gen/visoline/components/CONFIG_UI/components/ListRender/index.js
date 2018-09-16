import Registry from 'libs/Registry';
import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing, withProps } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';
import styles from '../../styles.scss';
import classnames from 'classnames';
import Column from '../Column';
import Row from '../Row';
import Icon from '@material-ui/core/Icon';
import _ from 'lodash';
import { List } from 'immutable';

export const ListRender = compose(
  withHandlers({
    onSaveKey: ({ prop, model }) => _.memoize((index) => (value) => {
      const list = model.get(prop, []);
      model.set(prop, list.set(index, value)).save();
    }),
  }),
  withProps(({ value }) => ({ list: List.isList(value) ? value: new List() })),
  withHandlers({
    onAddKey: ({ prop, model, onSaveKey, list }) => () => {
      model.set(prop, list.push('')).save();
    }
  }),
)(({ prop, list, onSaveKey, onAddKey }) => {
  return (
    <Row key={prop} >
      <Column w={0.4} >{prop}</Column>
      <Column w={0.6} >
        <Flex>
          {
            list.map((val, index) => {
              return (
                <Flex key={index} className={styles.tag}>
                  <EditableText value={val} onSave={onSaveKey(index)}/>
                </Flex>
              )
            }).toArray()
          }
          <Icon onClick={onAddKey}>add</Icon>
        </Flex>
      </Column>
    </Row>    
  )
});

export default ListRender;