import register from 'libs/Registry';

export const HiddenRender = () => null;
export default HiddenRender;

register('CONFIG_UI').register('hidden', HiddenRender);
