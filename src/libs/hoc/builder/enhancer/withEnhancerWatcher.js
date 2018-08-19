import { withItemWatcher } from 'libs/hoc/builder';

export const withEnhancerWatcher = (propName = 'enh') => withItemWatcher(propName, 'enhancer');

