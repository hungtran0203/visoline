import React from 'react';
import { compose, withHandlers, withState, renderComponent, branch, renderNothing } from 'recompose';
import EditableText from 'components/EditableText';
import { Flex, Box } from 'reflexbox';

export const EditableRender = compose(
  withHandlers({
    onSave: ({ prop, boxIt }) => (value) => {
      boxIt.set(prop, value).save();
    }
  }),
)(({ prop, value, onSave }) => {
  return (
    <Flex key={prop}>
      <Box w={0.4}>{prop}</Box>
      <Box w={0.6}>
        <EditableText value={value} onSave={onSave}/>
      </Box>
    </Flex>    
  )
});

export default EditableRender;
