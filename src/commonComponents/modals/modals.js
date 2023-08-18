import React, { useState, useEffect } from "react";
import "./modals.scss";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import "../../main.scss";
// Fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark, faTriangleExclamation,faCircleCheck, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from 'moment'
import * as _ from "lodash";
import { useNavigate } from "react-router-dom";

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


export const PulseComments = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
        onClose={handleClose}
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
                <IconButton aria-label="close" onClick={handleClose}>
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
                    <Chip label="5" color="primary" />
                  </Box>
                </Stack>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <Stack>
                    <TextField
                      placeholder="Leave comment (optional)"
                      multiline
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ mt: "25px" }}
                  >
                    <Button  variant="text" className="btn-text" type="reset">
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




export const EmployeeComment = ({ data ,pulse_comment,triggerClickEvent}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    triggerClickEvent(true)
  }
  const handleClose = () => setOpen(false);
  const commentStyle = {
    // fontSize: "1em !important",
    fontWeight: "bold",
    textDecoration:'underline',
    fontStyle: "unset !important",
    width: "100%",
    color: "#000",
    borderRadius: "0",
    textTransform: "capitalize",
    opacity:"1",
    cursor: "pointer"
  }

  const renderButtonData = (text = null) => {
    return (
      text ?  <>
      {text != 'Pulse Comment' && <svg
        height="20pt"
        viewBox="-21 -47 682.66669 682"
        width="20pt"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="m552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0" />
        <path d="m171.292969 131.171875h297.414062v37.5h-297.414062zm0 0" />
        <path d="m171.292969 211.171875h297.414062v37.5h-297.414062zm0 0" />
        <path d="m171.292969 291.171875h297.414062v37.5h-297.414062zm0 0" />
    </svg> }{text} </>: (
    <>
      View Comment
      <svg
        height="20pt"
        viewBox="-21 -47 682.66669 682"
        width="20pt"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="m552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0" />
        <path d="m171.292969 131.171875h297.414062v37.5h-297.414062zm0 0" />
        <path d="m171.292969 211.171875h297.414062v37.5h-297.414062zm0 0" />
        <path d="m171.292969 291.171875h297.414062v37.5h-297.414062zm0 0" />
    </svg>
    </>
  )
    )
  }
  return (
    <>
{data?.btnText == 'Pulse Comment' ?  
  <Typography variant="span" disabled={(pulse_comment.comment == "" || pulse_comment.comment == null) ? true:  false} size="100%" color="black" onClick={()=>{
    if(pulse_comment.comment !== "" && pulse_comment.comment !== null){handleOpen()}
  }}
  className={`commentButton ${(pulse_comment.comment == "" || pulse_comment.comment == null) ? ' comment-disabled ':  ''} ${pulse_comment.comment_status == 0 ? ' comment-notRead ' : ''}`}
  sx={commentStyle}
>
 {renderButtonData(data?.btnText)}
</Typography>
: 
        <Button  disabled={(pulse_comment.comment == "" || pulse_comment.comment == null) ? true:  false} variant="text" size="100%" color="black" onClick={()=>{handleOpen()}}
          className={`commentButton ${(pulse_comment.comment == "" || pulse_comment.comment == null) ? ' comment-disabled ':  ''} ${pulse_comment.comment_status == 0 ? ' comment-notRead ' : ''}`}
          sx={
            {
              minHeight: "42px",
              width: "100%",
              fontSize: "15px",
              color: "#000",
              borderRadius: "0",
              textTransform: "capitalize",
              opacity:"1",
          }
        }
      >
         {renderButtonData(data?.btnText)}
      </Button>}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="employee_comment-popup"
        // sx={{overflow:'auto'}}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Card>
              <div className="employee_comment-header">
                <IconButton aria-label="close" onClick={handleClose}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent>
                <Stack>
                  <Box>
                    <Stack className="employee_comment-contentHead">
                      <Typography variant="h2">Employee Comment</Typography>
                      <Typography variant="h6">
                        <span>Category:</span> {pulse_comment.category} 
                      </Typography>
                    </Stack>
                    <Stack className={pulse_comment?.category != 'Weekly Pulse' && 'employee_comment-contentHead'}>
                      <Typography>
                        {/* {JSON.stringify(pulse_comment)} */}
                        <span>{pulse_comment?.category != 'Weekly Pulse' && 'Current - '} {moment(pulse_comment.comment_time).format("MM/DD/YYYY")}: </span>{pulse_comment.comment != null ? <span style={{fontWeight:'normal'}} dangerouslySetInnerHTML={{ __html: pulse_comment.comment.split("\n").join("<br/>") }} /> : "N/A"}
                      </Typography>
                    </Stack>
                   
                      {pulse_comment?.category != 'Weekly Pulse' && 
                        <Stack> 
                          <Typography>
                            <span>Target - {moment(pulse_comment.comment_time).format("MM/DD/YYYY")}: </span>{pulse_comment.target_comment != null ? <span style={{fontWeight:'normal'}} dangerouslySetInnerHTML={{ __html: pulse_comment.target_comment.split("\n").join("<br/>") }} /> : "N/A"}
                          </Typography>
                        </Stack>
                      }
                  </Box>
                  {/* <Box></Box> */}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export const PerformanceNote = ({handleSubmit}) => {
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [getDate,setDate] = useState();
  const [getNote,setNote] = useState('');

  const getUTCTime = (date) => {
    if(!!date){
      var dt = new Date(new Date(date).getTime());
    }else{
      var dt = new Date(new Date().getTime());
      dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
    }
    // var offset = -300; // Timezone offset for EST in minutes.
    var utcDate = new Date(dt.getTime());
    return utcDate;
  }
  useEffect(()=>{
    setDate(moment(getUTCTime()).format('MM/DD/YYYY'))
  },[])
  const navigate = useNavigate();
  return (
    <>
      <Button 
        className="btn-border"
        onClick={handleOpen}
        sx={{
          minHeight: "42px",
          width: "100%",
          fontSize: "15px",
          color: "#000",
          borderRadius: "0",
          textTransform: "capitalize",
        }}
      >
        Send Performance Note
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
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
                <h4>Send Performance Note</h4>
                <IconButton aria-label="close" onClick={handleClose}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent
                sx={{ p: "0px 20px 20px" }}
                className="commentBoxWrap"
              >
                <Stack className="commentTopInfo">
                  <Typography sx={{ color: "#000", fontWeight: "bold" }}>
                   Note Date: {getDate}
                  </Typography>
                </Stack>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <Stack>
                    <TextField
                      placeholder="Add note"
                      multiline
                      value={getNote}
                      onChange={(element)=>{setNote(element.target.value)}}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ mt: "25px" }}
                  >
                    <Button variant="text" className="btn-text " onClick={()=>{setNote('')}}>
                      Clear
                    </Button>
                    <Button  variant="contained" className="btn-primary ml-2" onClick={()=>{handleSubmit(getNote);handleClose();setNote('');setSuccessOpen(true)}}>
                      Send To Performance Pro
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={successOpen}
        onClose={()=>setSuccessOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="info_popup-wrapper small"
      >
        <Fade in={successOpen}>
          <Box sx={style}>
            <Card
              sx={{
                boxShadow: "0px 2px 12px #00000065;",
                borderRadius: "10px",
              }}
            >
              <div className="info_popup-header">
                <IconButton aria-label="close" onClick={()=>{setSuccessOpen(false)}}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent>
                <FontAwesomeIcon icon={faCircleCheck} />
                <Typography sx={{marginTop: "35px", marginBottom:"25px"}} variant="h4">Note Submitted</Typography>
                <Typography sx={{marginBottom: "20px",}}>Your note has been sent to Performance Pro <strong> on {getDate}.</strong></Typography>
                <CardActions>
                  <Box>
                    <Button 
                      variant="contained"
                      className="btn-primary"
                      onClick={()=>{setSuccessOpen(false); navigate("/manager-dashboard");}}
                    >
                      Back To Dashboard
                    </Button>
                  </Box>
                </CardActions>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};


export const LoginFailedPopup = ({setOpenLoginError , openLoginError}) => {
  const handleClose = () => {setOpenLoginError(false)}
  return (
      <Modal
        open={openLoginError}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="info_popup-wrapper login-popup"
      >
        <Fade in={setOpenLoginError}>
          <Box sx={style}>
            <Card
              sx={{
                boxShadow: "0px 2px 12px #00000065;",
                borderRadius: "10px",
              }}
            >
              <div className="info_popup-header">
                <IconButton aria-label="close" onClick={handleClose}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent >
                <Box>
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  <Typography variant="h4" className="loginPopupTitle">Login Failed</Typography>
                  <Typography className="login-error-text">
                  Please try again, your user name and password combination did not match any registered user.
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Box>
                  <Button 
                    variant="contained"
                    className="btn-primary"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
  );
};

export const InfoPopup = ({setOpenLoginFailed , openLoginFailed}) => {
  const handleClose = () => {setOpenLoginFailed(false)}
  return (
      <Modal
        open={openLoginFailed}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="info_popup-wrapper login-popup"
      >
        <Fade in={setOpenLoginFailed}>
          <Box sx={style}>
            <Card
              sx={{
                boxShadow: "0px 2px 12px #00000065;",
                borderRadius: "10px",
              }}
            >
              <div className="info_popup-header">
                <IconButton aria-label="close" onClick={handleClose}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent >
                <Box>
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  <Typography variant="h4" className="loginPopupTitle">Login Failed</Typography>
                  <Typography>
                    Either your Performance Pro or Microsoft Teams username does
                    not exist or match your record. Please contact your HR
                    administrators. No further action is needed.
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Box>
                  <Button 
                    variant="contained"
                    className="btn-primary"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
  );
};

export const LogoutPopup = ({openLogoutFailed , setOpenLogoutFailed ,navigate ,cookies}) => {
  const handleClose = () => {
    setOpenLogoutFailed(false)
    cookies.set('token', "", { secure: true, sameSite:'none' });
    cookies.set('role', "", { secure: true, sameSite:'none' });
    cookies.set('profile', "", { secure: true, sameSite:'none' });
    cookies.set('graphClientProfile', "", { secure: true, sameSite: 'none' });
    navigate("/login");
  }
  return (
      <Modal
        open={openLogoutFailed}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="info_popup-wrapper login-popup"
      >
        <Fade in={setOpenLogoutFailed}>
          <Box sx={style}>
            <Card
              sx={{
                boxShadow: "0px 2px 12px #00000065;",
                borderRadius: "10px",
              }}
            >
              <div className="info_popup-header">
                <IconButton aria-label="close" onClick={handleClose}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent>
                <Box>
                  <FontAwesomeIcon icon={faDoorOpen} />
                  <Typography variant="h4" className="loginPopupTitle">Logged Out</Typography>
                  <Typography>
                  The Microsoft Teams account you’re currently logged in with does not match the Performance Pro user. Please use the associated Teams account.
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Box>
                  <Button 
                    variant="contained"
                    className="btn-primary"
                    onClick={handleClose}
                  >
                    Login
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
  );
};
