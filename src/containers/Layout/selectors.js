import { fromJS } from 'immutable';
import uuid from 'uuid';
import invariant from 'invariant';
import _ from 'lodash';
import storage from 'libs/storage';
import styles from './styles.scss';
import classnames from 'classnames';
import * as listHelper from 'libs/immutable/list';
import BoxModel from 'libs/editor/model/box';

export const selectBackground = (unsetVal = '#fff') => ({ activeItem$ }) => {
  let backgroundColor = unsetVal;
  const activeItem = activeItem$.get();
  if (activeItem) {
    const itemIt = BoxModel.getInstance(activeItem);
    backgroundColor = itemIt.getIn(['style', 'backgroundColor']);
  }
  return backgroundColor;
};
