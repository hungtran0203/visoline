import { compose, branch, renderNothing } from 'recompose';
import _ from 'lodash';

import { withStreamProps } from './withStreamProps';
import { valueMatching } from '../utils';
import { renderChild } from '../renderChild';

export const StreamBranch = compose(
  withStreamProps({ stateValue: (ownerProps) => _.get(ownerProps, 'stateName', 'branchState') }),
  branch(
    ({ stateValue, matching }) => !valueMatching(stateValue, matching),
    renderNothing,
  )
)(renderChild);
