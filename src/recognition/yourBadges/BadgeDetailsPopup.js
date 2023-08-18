import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import {Box,IconButton,Modal,Fade,Button,Typography, Stack,Avatar} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark,faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import './../RecognitionPopup.scss'
import badge from "../../commonAssets/images/badge2.jpeg";


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

const badgeAvatarStyle ={
  width: 135, 
  height: 135,
  mb:2,
  mx:"auto",
  border:"1px solid #707070",
  '@media(max-width:1600px)': {
      width: 115,
      height: 115,
  },

};

const BadgeDetails = ({openBadge ,handleCloseBadge, data}) => {

    return (
      <div className='addTeamPopup'>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openBadge}
          onClose={handleCloseBadge}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          className="recognitionPopup"
        >
          <Fade in={openBadge}>
            <Box sx={style}>

                <div className='popupBody large'>
                    <IconButton className='grayClose'  aria-label="close" onClick={handleCloseBadge}>
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                    <Stack sx={{textAlign:"center"}} mt={2}>
                        <Avatar
                            className='badgeAvatar'
                            alt={data?.name}
                            src={data?.image_url != null ? data?.image_url : badge}
                            sx={badgeAvatarStyle}
                        />
                        <Typography className='headerTitle colorPrimary'  mb={3}>{data?.name}</Typography>
                        <Typography className='popupDescriptionLarge' mb={2} mt={2} >{data?.description}</Typography>
                        <Typography mb={1} ><i>Given by Jonathon Smith - 03/22/2023</i></Typography>
                    </Stack>
                    <Stack mt={2} sx={{flexDirection:"row", justifyContent:"center", }}>
                        <Button sx={{maxWidth:"280px"}} variant="contained" className='btn-primary btn-full btn-md' onClick={handleCloseBadge} >Close</Button>
                   </Stack>
                </div>


            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }
  
  
  
  
  export default BadgeDetails;