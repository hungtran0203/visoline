import register from 'libs/register';

export const HiddenRender = () => null;
export default HiddenRender;

register('CONFIG_UI').register('hidden', HiddenRender);
