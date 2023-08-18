import React, { useEffect, useState } from "react";
import { Popper, Box, Stack, Typography, IconButton, Button, RadioGroup, Radio, FormControlLabel, LinearProgress, FormGroup, Placeholder } from '@mui/material';
import './pulseFilter.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFilter } from "@fortawesome/free-solid-svg-icons";
import ClickAwayListener from '@mui/base/ClickAwayListener';

// import OutlinedInput from '@mui/material/OutlinedInput';
// import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import Select, { components, ControlProps } from 'react-select'



function PulseFilter({ data, handleOnChange, loading, filterList, handleFilterChange, selected, active, clearEvent, disabledCheck }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [getSelected, setSelected] = React.useState({});
    const [getLocalSelected, setLocalSelected] = React.useState({});

    React.useEffect(() => {
        setLocalSelected({ ...selected })
    }, [selected]);



    const handleClick = (event) => {
        if (disabledCheck) {
            setAnchorEl(anchorEl ? null : event.currentTarget);
        }

    };

    const open = Boolean(anchorEl);
    const id = open ? 'sortFilter' : undefined;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const [selectedValue, setSelectedValue] = React.useState("");

    const handleChange = (event) => {
        setLocalSelected({});
        // handleFilterChange({});

        setSelectedValue(event?.value);
        handleOnChange(event?.value);
    };

    useEffect(() => {
        if (clearEvent == true) {
            setLocalSelected({});
            handleFilterChange(null, {});
            setSelectedValue("");
            handleOnChange("");
        }
    }, [clearEvent])
    return (
        <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => {
            setAnchorEl(null);
            setLocalSelected({ ...selected })
        }}>
            <div>
                {/* <Button  aria-describedby={id} type="button" onClick={handleClick} className={anchorEl ? 'sortBtn customPopper opened' : 'sortBtn customPopper'}>
                Sort<FontAwesomeIcon icon={faSort} />
                </button> */}
                <Button
                    aria-describedby={id}
                    onClick={handleClick}
                    variant="contained"
                    disabled={!disabledCheck}
                    //   className="btn-primary"
                    className={`${anchorEl ? 'btn-primary sortBtn customPopper opened' : 'btn-primary sortBtn customPopper'} ${!disabledCheck ? 'disable_button' : ''}`}
                    endIcon={<FontAwesomeIcon icon={faFilter} />}
                >
                    Filter
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
                            sx={{ pb: 1 }}
                        >
                            <Typography variant="h6" sx={{ fontSize: "16px", color: "#000", fontWeight: "bold", }} >
                                Filter By
                            </Typography>
                            <IconButton className="closeBtn" aria-label="close" sx={{ fontSize: "18px", color: "#707070", p: 0 }} onClick={handleClick} >
                                <FontAwesomeIcon icon={faXmark} />
                            </IconButton>
                        </Stack>
                        <Stack>
                            <div className="filter_body">

                                <Select
                                    defaultValue={() => {
                                        let record = data?.find(item => item.value == selectedValue);
                                        if (record != null && Object.keys(record)?.length > 0) {
                                            return { "value": record.value, "label": record.name }
                                        }
                                    }}
                                    onChange={handleChange}
                                    isSearchable
                                    options={data?.map((item, index) => { return { "value": item.value, "label": item.name } })}
                                    classNamePrefix="cMultiSelect"
                                />


                                {
                                    loading ?
                                        <LinearProgress />
                                        :
                                        <FormGroup className="multiCheckboxList">
                                            {
                                                filterList?.map((item, index) =>
                                                    <>
                                                        {/* {(getLocalSelected[item?.employee_id] != undefined && getLocalSelected[item?.employee_id] == true) ? 'true' : 'false'} */}
                                                        <FormControlLabel
                                                            key={index}

                                                            control={<Checkbox
                                                                checked={(getLocalSelected[item?.employee_id != undefined ? item?.employee_id : item?.id] != undefined && getLocalSelected[item?.employee_id != undefined ? item?.employee_id : item?.id] == true) ? true : false}
                                                                // checked={true}
                                                                value={item?.employee_id != undefined ? item?.employee_id : item?.id}
                                                                onChange={
                                                                    (element) => {
                                                                        let selectedValue = !getLocalSelected[element?.target?.value];
                                                                        setLocalSelected({ ...getLocalSelected, [element?.target?.value]: selectedValue })
                                                                    }
                                                                    // handleFilterChange(element?.target?.value)
                                                                }
                                                            />}
                                                            label={`${item?.name} ${item?.direct_reports_count != undefined ? '(' + item?.direct_reports_count + ')' : ''}`}
                                                        />
                                                    </>
                                                )
                                            }
                                        </FormGroup>

                                }
                            </div>
                            <div className="filter_footer">
                                <Button variant="contained"
                                    sx={{ marginTop: "10px", maxWidth: "155px" }}
                                    // onClick={handleClick} 
                                    className='btn-primary '
                                    onClick={
                                        (event) => {
                                            handleFilterChange(selectedValue, getLocalSelected);
                                            setAnchorEl(null);
                                            // setAnchorEl(anchorEl ? null : event.currentTarget);
                                        }
                                    }
                                >Save</Button>
                                <Button
                                    variant="text"
                                    sx={{ marginTop: "0px", maxWidth: "80px" }}
                                    onClick={
                                        (event) => {
                                            setLocalSelected({});
                                            handleFilterChange(null, {});
                                            setSelectedValue("");
                                            handleOnChange("");
                                            setAnchorEl(null);
                                            // setAnchorEl(anchorEl ? null : event.currentTarget);
                                        }
                                    }
                                    className='btn-text'
                                >
                                    Clear
                                </Button>
                            </div>
                        </Stack>
                    </Box>
                </Popper>
            </div>
        </ClickAwayListener>

    );
}




export default PulseFilter;