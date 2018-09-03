const ColorModifier = compose(
  withEditorHoc,
  withStreamProps({
    activeItem: [ACTIVE_ITEM_STREAM, { init: null }],
  }),
  branch(({ activeItem }) => !activeItem, renderNothing),
  withHandlers({
    onChange: (props) => (color) => {
      handlers.changeBackground(props)(color);
    }
  }),
  withProps((props) => ({ color: selectors.selectBackground()(props) })),
  pickProps(['onChange', 'onChangeComplete', 'color']),
)((props) => <ColorPicker {...props} />);
