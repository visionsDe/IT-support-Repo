import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { Button, Modal, Fade, Card, Box, IconButton, CardContent, Stack, Typography, Chip, TextField, Backdrop } from "@mui/material";
import { setPulseCommentList } from '../../reducer/engagementPillars';
import { getPulseCommentAction, setPulseCommentAction } from '../../actions/engagement';
import { useDispatch } from 'react-redux';
import * as _ from "lodash";
import { useSnackbar } from 'notistack';

export const PulseComments = ({ saveResponse, pulseRatingValue ,pulseCommentList }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch()
  const [pulseCommentInput, setPulseCommentInput] = React.useState("");
  const handleOpen = () => setOpen(true);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const getPulseComment = async() => {
    const getComment =  await getPulseCommentAction("emp/pulsecomment")
    if(getComment && getComment != ''){
    dispatch(setPulseCommentList(getComment))
    setPulseCommentInput(getComment.comment)
  }
  }

  const handleClose = async() => {
      setOpen(false);
    let payloadData ={
      comment: pulseCommentInput
    }
   let setData = await setPulseCommentAction("emp/pulsecomment" ,payloadData)
   if(setData){
    let variant = "success";
    enqueueSnackbar("Comment Submitted", { variant });
    getPulseComment();
   }else{
    let variant = "error";
    enqueueSnackbar("Error: Could not submit", { variant });
    
   }
 
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 30px)",
    maxWidth: "578px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 0,
    borderRadius: "20px",
    overflow: "hidden",
  };

  useEffect(() => {
    getPulseComment()
  }, [])

  return (
    <>
      <Button 
        size="100%"
        color="white"
        onClick={handleOpen}
        className="btn-primary"
        sx={{
          textTransform: "capitalize",
          textDecoration: "underline",
          padding: "0px",
        }}
      >
        Add Comment
        <FontAwesomeIcon icon={faComment} />
      </Button>
      <Modal
        open={open}
        onClose={()=> {setOpen(false);setPulseCommentInput(pulseCommentList.comment)}}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="customPopup"
      >
        <Fade in={open}>
          <Box sx={style}>
            <Card
              sx={{
                boxShadow: "0px 2px 12px #00000065;",
                borderRadius: "10px",
              }}
            >
              <div className="popupHeader">
                <h4>Add comment</h4>
                <IconButton aria-label="close" onClick={()=> {setOpen(false);setPulseCommentInput(pulseCommentList.comment)}}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent sx={{ p: "20px 20px" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mb: "10px",
                  }}
                >
                  <Typography sx={{ color: "#000", fontWeight: "bold" }}>
                    Weekly Pulse
                  </Typography>
                  {(!!saveResponse && pulseRatingValue != "0") &&
                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography
                        sx={{
                          color: "#707070",
                          fontSize: "12px",
                          fontWeight: "bold",
                          mr: "7px",
                        }}
                      >
                        Your Rating
                      </Typography>
                      <Chip sx={{fontWeight: "bold", fontSize:"14px",minWidth:"32px"}}  label={pulseRatingValue != null ? pulseRatingValue : '-'} color="primary" className='darkBackground' />
                    </Box>}
                </Stack>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <Stack>
                    <TextField
                      value={pulseCommentInput}
                      onChange={(element)=> setPulseCommentInput(element.target.value)}
                      placeholder="Leave comment (optional)"
                      multiline
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ mt: "25px" }}
                  >
                    <Button  variant="text" className="btn-text" type="reset" onClick={()=>{setPulseCommentInput('')}}>
                      Clear
                    </Button>
                    <Button  variant="contained" onClick={handleClose} className="btn-primary ml-2">
                      Save Comment
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};