import React, { useEffect, useState  } from 'react'
import Backdrop from '@mui/material/Backdrop';
import {Box,IconButton,Modal,Fade,Button,Typography, Stack,Grid, FormControl, Select, MenuItem} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark,faTriangleExclamation, faAward } from "@fortawesome/free-solid-svg-icons";
import './../../RecognitionPopup.scss'
import { useSelector } from 'react-redux';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "calc(100% - 30px)",
  maxWidth: 580,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: "20px",
  p: 0,
};



function TargetComplete(props) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {setOpen(true)}
    const handleClose = () => setOpen(false);
    const { userInfo } = useSelector(state => state.recognitionDashboard);
    const [selectedEmployee,setSelectedEmployee] = React.useState(null);
    const [sortEmployees,setSortEmployees] = React.useState([]);
  
    // const distantFuture = new Date(8640000000000000)
    //     const firstSort = 'progress_time';
    //      setSortEmployees([...props?.data]?.sort(
    //       (a,b) => {
    //         let dateA = a[firstSort] ? new Date(a[firstSort]) : distantFuture
    //         let dateB = b[firstSort] ? new Date(b[firstSort]) : distantFuture
    //         return dateA.getTime() - dateB.getTime()
    //       } ))

    const updateProgressRecord = () => {
      setSortEmployees(props?.data?.slice()?.sort((a,b) => b?.progress_time - a?.progress_time));
      setSelectedEmployee(props?.data?.slice()?.filter(item => item?.progress == 100)?.sort((a,b) => b?.progress_time - a?.progress_time)[0]?.employee_id)
    }
    React.useEffect(() => {
      updateProgressRecord();
      

    },[props]);

    
    return (
      <div className='addTeamPopup'>
        <Button sx={{ mt: 2, boxShadow: "none" }} 
          disabled={(userInfo?.employee_id == props?.creator && (props?.data?.filter(item => item?.progress == 100)?.length > 0) ) ? false : true} 
          variant="contained" 
          className='btn-primary btn-full' 
          onClick={handleOpen}
        >
          Mark Complete 
        </Button>
        {/* <Modal
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

                <div className='popupBody large'>
                    <IconButton className='grayClose'  aria-label="close" onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                    <Stack sx={{textAlign:"center"}} mt={2}>
                        <Typography className='headerTitle colorPrimary'  mb={3}>Target Completed!</Typography>
                        <Typography className='popupDescriptionLarge' mb={1} mt={2} ><strong>{props.data?.full_name}</strong> completed the selected target. They will receive <strong>{props.points} points</strong> and the target will be moved to the archive. Do you approve?</Typography>
                    </Stack>
                    <Stack mt={2} sx={{flexDirection:"row", justifyContent:"center"}}>
                        <Button variant="contained" className='btn-border' sx={{width:"125px", mr:2}} onClick={handleClose}>No</Button>
                        <Button variant="contained" className='btn-primary minWidthAuto' sx={{width:"125px"}} onClick={
                          () => {
                            props.handleTargetApproveEvent(true);
                            handleClose()
                          }
                        } >Yes</Button>
                   </Stack>
                </div>


            </Box>
          </Fade>
        </Modal> */}
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

                <div className='popupBody large'>
                    <IconButton className='grayClose'  aria-label="close" onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                    <Stack sx={{textAlign:"center"}} mt={2}>
                        <FontAwesomeIcon className='colorPrimary' style={{fontSize:'69px', marginBottom:'28px'}} icon={faAward} />
                        <Typography className='headerTitle colorPrimary'  mb={3}>Award Points?</Typography>
                        <Typography className='popupDescriptionLarge' mb={1} mt={2} > The selected employee has completed the target first. Would you like to reward the <strong>{props.points} points</strong> and mark the target complete?</Typography>
                    </Stack>
                    <Stack >
                    <FormControl sx={{ width:'100%',margin: '15px auto', maxWidth: '420px' }}>
                      <Select
                        className='customSelect height50'
                        value={selectedEmployee}
                        onChange={(element) => {
                          setSelectedEmployee(element?.target.value);
                        }}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {
                          sortEmployees?.map((employee, index) => <MenuItem key={index} value={employee?.employee_id}>{employee?.full_name != null ? employee?.full_name : 'Not Available'}</MenuItem>)
                        }
                      </Select>
                    </FormControl>
                    </Stack>
                    <Stack mt={2} sx={{flexDirection:"row", justifyContent:"center"}}>
                        <Button variant="contained" className='btn-primary btn-xl' sx={{width:'100%',maxWidth:"340px"}} 
                          onClick={
                            () => {
                              props.handleTargetApproveEvent(selectedEmployee);
                              handleClose()
                            }
                          } 
                        >Send Points</Button>
                   </Stack>
                </div>


            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }
  
  
  
  
  export default TargetComplete;