import { withStreams } from 'libs/hoc';
import Registry from 'libs/Registry';

export const hoc = ({ propName, srcStream }) => withStreams({ [propName]: [srcStream] });

export default hoc;
