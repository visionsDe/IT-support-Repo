import React, { useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import { Box, IconButton, Modal, Fade, Paper, Button, InputBase, List, ListItem, ListItemText, Typography } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import './../RecognitionPopup.scss';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "calc(100% - 30px)",
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: "20px",
  p: 0,
};



function AddTeam(props) {
  const [open, setOpen] = React.useState(false);
  const [getEmployeeList, setEmployeeList] = React.useState([])
  const [searchEmployeeInput, setSearchEmployeeInput] = React.useState("")
  const handleOpen = () => {
    setOpen(true);
    setEmployeeList(props.assigned_employees);
    setSearchEmployeeInput("");
  };
  const handleClose = () => setOpen(false);
  const [getSelectedEmployee, setSelectedEmployee] = useState({});

  const [isActive, setActive] = React.useState(false);
  const ToggleClass = (e) => {
    setActive(e);
  };

  const [iconButtonShow, iconButtonResults] = React.useState(props.iconBtn)
  const empList = props.assigned_employees;
  const activeEmpList = props.activeEmpList;
  const selectEvent = props?.selectEvent !== undefined ? props.selectEvent : () => { };
  const handleChangeSearch = (e) => {
    setSearchEmployeeInput(e.target.value)
    if (!!e.target.value) {
      const filterListing = empList.filter((item) => { return item.full_name.toLowerCase().includes(e.target.value.trim().toLowerCase()) })
      console.log('filterListing ', filterListing)
      if(filterListing?.length == 0){
        setActive(false);
        setSelectedEmployee({});
      }
      setEmployeeList(filterListing)
    }
    else {
      setEmployeeList(empList)
    }
  }
  return (
    <div className='addTeamPopup'>
      {iconButtonShow ?
        <IconButton onClick={handleOpen} variant="solid" className="addTeamBtn">
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
        :
        <Typography onClick={handleOpen} className="font14" sx={{ fontWeight: "600" }}>{props.title}</Typography>
      }
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="recognitionPopup"
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="popupHeader headerBlue">
              <Typography className="headerTitle">{props.title}</Typography>
              <IconButton className='whiteClose' aria-label="close" onClick={handleClose}>
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
            </div>
            <div className='popupBody small'>
              <div className='customSearch'>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Employees"
                    inputProps={{ 'aria-label': 'Search Employees' }}
                    value={searchEmployeeInput}
                    onChange={handleChangeSearch}
                  />
                  <IconButton type="button" sx={{ p: '8px 15px' }} aria-label="search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </IconButton>
                </Paper>
              </div>
              { getEmployeeList?.length > 0 ?
                <div className='cInputWrap'>
                  <label>Choose an employee:</label>
                  <div className={"empSelectWrap " + (getEmployeeList?.length > 10 ? 'scrollable' : '')} >
                    <List className="empSelectList " >
                      {getEmployeeList?.map((data, i) => (
                        <ListItem key={i} className={(isActive === data?.employee_id ? "active" : "")}
                          disabled={activeEmpList?.find(item => data?.employee_id === item.employee_id) ? true : false}
                          onClick={
                            () => {
                              if (activeEmpList?.find(item => data?.employee_id === item.employee_id) === undefined) {
                                ToggleClass(data?.employee_id)
                                setSelectedEmployee(empList.find(item => data?.employee_id === item.employee_id))
                              }
                            }
                          }>
                          <ListItemText primary={data.full_name} />
                        </ListItem>

                      ))}
                    </List>
                  </div>
                </div>
                :
                <div className="searchNoResults">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <p>We couldn't find any matches. Please search again.</p>
                </div>
              }
            <div className='popupBtnWrap'>
              <Button variant="text" className={'btn-text decorationNone'} sx={{ padding: "0px", textDecoration: "none" }} 
                onClick={() => 
                  {
                    handleClose(); 
                    setActive(false);
                    setSelectedEmployee({});
                  }
                }>
                Cancel
              </Button>
              <Button variant="contained"
                sx={{ marginTop: "0px" }}
                className='btn-primary'
                disabled={Object.keys(getSelectedEmployee || {})?.length == 0 ? true : false}
                onClick={() => {
                  selectEvent(getSelectedEmployee);
                  handleClose();
                }}
              >Add Employee</Button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
      </div >
    );
}




export default AddTeam;