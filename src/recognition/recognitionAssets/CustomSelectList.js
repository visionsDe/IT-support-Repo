import React from 'react';
import { FixedSizeList as List } from "react-window";
import {Stack} from '@mui/material';

const height = 35;
const MenuList =(props)=> {
 
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;
    return (
      !!children.length && children.length>0 ?
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>:
      <Stack p={2} >
        No Results Found
        </Stack>
    );
  
}
export default MenuList