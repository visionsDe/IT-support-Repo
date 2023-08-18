import React, { useState } from "react";
import {Popper, Box, Stack, Typography,IconButton,Button,RadioGroup,Radio,FormControlLabel} from '@mui/material';
import './Sort.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import ClickAwayListener from '@mui/base/ClickAwayListener';

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilter } from "@fortawesome/free-solid-svg-icons";



function SortFilter({selected, data, defaultSelect, buttonDisabled = false, disabledCheck}) {
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [getSelected, setSelected] = React.useState(null)
    
    const handleClick = (event) => {
        if(disabledCheck){
            setAnchorEl(anchorEl ? null : event.currentTarget);
        }
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'sortFilter' : undefined;
  
    return (
        <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={()=>setAnchorEl(null)}>
            <div>
            {/* <Button  aria-describedby={id} type="button" onClick={handleClick} className={anchorEl ? 'sortBtn customPopper opened' : 'sortBtn customPopper'}>
                Sort<FontAwesomeIcon icon={faSort} />
            </button> */}
            <Button 
            aria-describedby={id}
            onClick={handleClick}
            variant="contained"
            //   className="btn-primary"
            disabled={!disabledCheck}
              className={`${anchorEl ? 'btn-primary sortBtn customPopper opened' : 'btn-primary sortBtn customPopper'} ${!disabledCheck ? 'disable_button' : ''}`}
              endIcon={<FontAwesomeIcon icon={faArrowDownWideShort} />}
            >
              Sort
            </Button>
            <Popper 
                id={id} 
                open={open} anchorEl={anchorEl} 
                placement="bottom"
                disablePortal={false}
                modifiers={[
                    {
                    name: 'flip',
                    enabled: true,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                    },
                    {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        altAxis: true,
                        altBoundary: true,
                        tether: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                    },
                    {
                    name: 'arrow',
                    enabled: true,
                    options: {
                        element: anchorEl,
                    },
                    },
                ]}>
                <Box className="sortFilterDropdown" data-popper-arrow>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: "1px solid #707070", mb: "10px",pb:1 }}
                    >
                        <Typography variant="h6" sx={{ fontSize:"16px", color: "#000", fontWeight: "bold", }} >
                            Sort By
                        </Typography>
                        <IconButton className="closeBtn" aria-label="close" sx={{fontSize:"18px",color: "#707070", p:0}} onClick={handleClick} >
                            <FontAwesomeIcon icon={faXmark} />
                        </IconButton>
                    </Stack>
                    <Stack >
                        <RadioGroup
                            defaultValue={defaultSelect}
                            name="radio-buttons-group"
                            className="sortRadios"
                            onChange={(element)=>{
                                setSelected(element?.target?.value);
                            }}
                        >
                            {
                                data?.map((item,index) => <FormControlLabel value={item?.value} key={index} control={<Radio />} label={item?.name} />)
                            }
                        </RadioGroup>
                        <Button  
                            variant="contained" 
                            sx={{marginTop:"10px", maxWidth:"155px"}} 
                            onClick={()=>{
                                handleClick();
                                if(getSelected != null){
                                    selected(getSelected);
                                }
                            }}
                            disabled={buttonDisabled}
                            className='btn-primary ' 
                        >
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Popper>
            </div>
        </ClickAwayListener>

    );
  }
  
  
  
  
  export default SortFilter;