import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import {Box,IconButton,Modal,Fade,Button,Typography, Stack,Grid} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark,faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import './../../RecognitionPopup.scss'



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "calc(100% - 30px)",
  maxWidth: 640,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: "20px",
  p: 0,
};



function TargetDelete({itemId,triggerEvent}) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {setOpen(true);}
    const handleClose = () => setOpen(false);
    return (
      <div className='addTeamPopup'>
        <Typography className="font14" onClick={handleOpen} sx={{fontWeight:"600"}}>Delete</Typography>
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
                    <Stack sx={{textAlign:"center"}}>
                        <FontAwesomeIcon className='popupMainIcon colorPrimary' icon={faTriangleExclamation} />
                        <Typography className='headerTitle colorPrimary' mb={3}>Delete Target?</Typography>
                        <Typography className='popupDescriptionLarge' mb={1} mt={2} px={3}>Are you sure you would like to delete this target, along with all related progress, assignees and comments?</Typography>
                    </Stack>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={6}>
                            <Button variant="contained" className='btn-border large btn-full btn-xxl' onClick={handleClose}>Cancel</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" className='btn-primary large btn-full btn-xxl' onClick={()=>{handleClose();triggerEvent(itemId);}} >Delete</Button>
                        </Grid>

                    </Grid>
                </div>


            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }
  
  
  
  
  export default TargetDelete;