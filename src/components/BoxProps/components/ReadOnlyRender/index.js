import React from 'react';
import { Flex, Box } from 'reflexbox';

export const ReadOnlyRender = ({ prop, value }) => {
  return (
    <Flex key={prop}>
      <Box w={0.4}>{prop}</Box>
      <Box w={0.6}>{value}</Box>
    </Flex>    
  )
};

export default ReadOnlyRender;
