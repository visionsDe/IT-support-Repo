import React, { useEffect, useState } from "react";
import { Button, Modal, Backdrop, IconButton, Typography, TextField, Chip, Stack, Fade, Card, CardContent, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendEngagementCategoryRequestAction } from "../../actions/engagement";
import { useSnackbar } from "notistack";
import * as _ from "lodash";
import { setEngagementCategory } from "../../reducer/engagementPillars";
import { updateEngagement } from "../../helper/helper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc(100% - 30px)",
  maxWidth: "578px",
  maxHeight:"80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 0,
  borderRadius: "20px",
  overflow: "auto",
};
const RenderComments = ({ item, index, globalSet, setActive, code }) => {
  const [getComment, setComment] = useState();
  const [getCommentTarget, setCommentTarget] = useState();
  const dispatch = useDispatch()
 useEffect(()=>{
  setComment(item.updatedComments == undefined ? item?.comments?.comment : item?.updatedComments?.comment)
  setCommentTarget(item.updatedComments == undefined ? item?.comments?.target_comment : item?.updatedComments?.target_comment)
 },[item])
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { engagementCategories } = useSelector((state) => state.engagementCategory);
  const handleValueToSend = (element) => {
    setComment(element.target.value);
    if(item.comments != undefined){
      var newObj = { ...item.comments, comment: element.target.value, target_comment: getCommentTarget}
      var newItem = { ...item, comments: newObj }
    }else{
      var newObj = { engagement_category: item.code, update_time: '', comment: element.target.value, target_comment: getCommentTarget }
      var newItem = { ...item, comments: newObj }
    }
    globalSet(newItem)
  }
  const handleTargetValueToSend = (element) => {
    setCommentTarget(element.target.value);
    if(item.comments != undefined){
      var newObj = { ...item.comments, target_comment: element.target.value, comment: getComment }
      var newItem = { ...item, comments: newObj }
    }else{
      var newObj = { engagement_category: item.code, update_time: '', target_comment: element.target.value, comment: getComment }
      var newItem = { ...item, comments: newObj }
    }
    globalSet(newItem)
  }
  const handleClearComment = () => {
    setComment('');
    setCommentTarget('');
    let newObj = { ...item.comments, comment: '', target_comment:'' }
    let newItem = { ...item, comments: newObj ,updatedComments: newObj }
    globalSet(newItem)
  }
  const submitComment = async () => {
    setActive(false)
    if (!!item && (item?.updatedComments?.comment != item?.comments?.comment || item?.updatedComments?.target_comment != item?.comments?.target_comment)) {
      let result = await sendEngagementCategoryRequestAction("emp/comment", [item?.updatedComments]);
      if (result.status.toLowerCase() == "ok") {
        let variant = "success";
        enqueueSnackbar("Comment Submitted", { variant });
        updateEngagement(dispatch);
      } else if (result.status.toLowerCase() == "error") {
        let variant = "error";
        enqueueSnackbar(`Error: Could not submit`, {
          variant,
        });
      }
    }
    else {
      let variant = "error";
      enqueueSnackbar(`Error: No changes to submit`, { variant });
    }
  }
  return (
    <>
      <Stack className="commentTopInfo">
        <Typography sx={{ color: "#000", fontWeight: "bold" }}>
          Target
        </Typography>
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
        >
        </Box>
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              mr: "3px",
              fontSize: "12px",
              color: "#707070",
            }}
          >
            <strong>{!!item?.updatedTarget && item?.updatedTarget?.target != item?.score?.target ? 'Change:' : 'Your Rating'}</strong>
          </Typography>
          {!!item?.updatedTarget && item?.updatedTarget?.target != item?.score.target ?
            <>
              <Chip
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  p: 0,
                  "& .MuiChip-label": {
                    paddingLeft: "2px",
                    paddingRight: "6px",
                  },
                }}
                label={JSON.stringify(item.updatedTarget.target) != 'null' ? item.updatedTarget.target : '-'}
                style={{ backgroundColor: 'transparent' }}
              />
            </>
            : 
            (item?.updatedTarget?.target == item?.score.target ?
              ""
              :
            (item?.updatedTarget?.target ? 
              <>
              <Chip
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    p: 0,
                    "& .MuiChip-label": {
                      paddingLeft: "2px",
                      paddingRight: "6px",
                    },
                  }}
                  label={!!item?.updatedTarget ? item?.updatedTarget?.target : '-'}
                  style={{ backgroundColor:'transparent' }}
                />
              </>
             : '')
            )
          }
          {item.updatedTarget == undefined ?
            <>
            <Chip
              sx={{ ml: "4px", fontWeight: "bold", fontSize: "14px" }}
              label={JSON.stringify(item.score.target) != 'null' ? item.score.target : '-'}
              color="primary"
              className="darkBackground"
            /></> : 
                <>
                {
                  item?.updatedTarget?.target == item?.score.target ? 
                  ''
                  : 
                  <Typography sx={{ fontSize: "14px", mr:"1px" }}>
                <strong>to</strong>
              </Typography>
                }
                
            <Chip
              sx={{ ml: "4px", fontWeight: "bold", fontSize: "14px" }}
              label={JSON.stringify(item.score.target) != 'null' ? item.score.target : '-'}
              color={item?.updatedTarget?.target > (JSON.stringify(item.score.target) != 'null' ? item.score.target : '-') ? 'error' : (item?.updatedTarget?.target == item?.score.target ? 'primary' : 'success' )}
              className={item?.updatedTarget?.target > (JSON.stringify(item.score.target) != 'null' ? item.score.target : '-') ? '' : (item?.updatedTarget?.target == item?.score.target ? 'darkBackground' : '' )}
            />
            </>
              
            }
        </Box>
      </Stack>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { width: "100%" } }}
        noValidate
        autoComplete="off"
      >

        <Stack sx={{ margin: "1px 0px" }}>
          <TextField
            placeholder="Leave Target comment (optional)"
            multiline
            value={getCommentTarget}
            onChange={handleTargetValueToSend}
          />
        </Stack>
      </Box>

      <Stack className="commentTopInfo">
        <Typography sx={{ color: "#000", fontWeight: "bold" }}>
          Current
        </Typography>
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
        >
        </Box>
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              mr: "3px",
              fontSize: "12px",
              color: "#707070",
            }}
          >
            <strong>{!!item?.updatedCurrent && item?.updatedCurrent?.score != item?.score?.score ? 'Change:' : 'Your Rating'}</strong>
          </Typography>
          {!!item?.updatedCurrent && item?.updatedCurrent?.score != item?.score.score ?
            <>
            <Chip
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  p: 0,
                  "& .MuiChip-label": {
                    paddingLeft: "2px",
                    paddingRight: "6px",
                  },
                }}
                label={JSON.stringify(item.updatedCurrent.score) != 'null' ? item.updatedCurrent.score : '-'}
                style={{ backgroundColor: 'transparent' }}
              />
            </>
            : 
            (item?.updatedCurrent?.score == item?.score.score ?
              ""
              :
            (item?.updatedCurrent?.score ? 
              <>
              <Chip
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    p: 0,
                    "& .MuiChip-label": {
                      paddingLeft: "2px",
                      paddingRight: "6px",
                    },
                  }}
                  label={!!item?.updatedCurrent ? item?.updatedCurrent?.score : '-'}
                  style={{ backgroundColor:'transparent' }}
                />
              </>
             : '')
            )
          }
          {item.updatedCurrent == undefined ?
         <>
            <Chip
              sx={{ ml: "4px", fontWeight: "bold", fontSize: "14px" }}
              label={JSON.stringify(item.score.score) != 'null' ? item.score.score : '-'}
              color="primary"
              className="darkBackground"
            /></> : 
                <>
                {
                  item?.updatedCurrent?.score == item?.score.score ? 
                  ''
                  : 
                  <Typography sx={{ fontSize: "14px", mr:"1px" }}>
                <strong>to</strong>
              </Typography>
                }
                
            <Chip
              sx={{ ml: "4px", fontWeight: "bold", fontSize: "14px" }}
              label={JSON.stringify(item.score.score) != 'null' ? item.score.score : '-'}
              color={item?.updatedCurrent?.score > (JSON.stringify(item.score.score) != 'null' ? item.score.score : '-') ? 'error' : (item?.updatedCurrent?.score == item?.score.score ? 'primary' : 'success' )}
              className={item?.updatedCurrent?.score > (JSON.stringify(item.score.score) != 'null' ? item.score.score : '-') ? '' : (item?.updatedCurrent?.score == item?.score.score ? 'darkBackground' : '' )}

            />
            </>
              
            }
        </Box>
      </Stack>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { width: "100%" } }}
        noValidate
        autoComplete="off"
      >
        <Stack sx={{ margin: "1px 0px" }}>
          <TextField
            placeholder="Leave Current comment (optional)"
            multiline
            value={getComment}
            onChange={handleValueToSend}
          />
        </Stack>
        {!!code &&
          <Stack
            direction="row"
            justifyContent="flex-end"
            textAlign="right"
            sx={{ mt: "25px" }}
          >
            <Button  variant="text" className="btn-text " onClick={handleClearComment}>
              Clear
            </Button>
            <Button  variant="contained" className="btn-primary ml-2"
              onClick={() => {
                submitComment()
                }}>
              Save Comment
            </Button>
          </Stack>}
      </Box>
    </>
  )
}
export const CommentsList = ({ code, handleComment, title = 'NA' }) => {
  const { engagementCategories } = useSelector((state) => state.engagementCategory);
  const [active, setActive] = useState(false);
  const [commentList, setCommentList] = useState(code != '' ? engagementCategories?.filter(item => item.code == code) : engagementCategories);
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    setCommentList(code != '' ? engagementCategories?.filter(item => item.code == code) : engagementCategories)
  }, [engagementCategories])

  const handleSubmitComments = async () => {
    setActive(!!active ? false : true)
    let updatedComment = []
    for (let i in engagementCategories) {
      if (!!engagementCategories[i] && !!engagementCategories[i]?.updatedComments) {
        updatedComment.push(engagementCategories[i]?.updatedComments)
      }
    }
    if (updatedComment.length > 0) {
      let result = await sendEngagementCategoryRequestAction("emp/comment", updatedComment);
      if (result.status.toLowerCase() == "ok") {
        let variant = "success";
        enqueueSnackbar("Comment Submitted", { variant });
      } else if (result.status.toLowerCase() == "error") {
        let variant = "error";
        enqueueSnackbar(`Error: Could not submit`, { variant });
      }
    }
    else {
      let variant = "error";
      enqueueSnackbar(`Error: No changes to submit`, { variant });
    }
    // == ======== scores Update == =====
    let updatedScores = []
    for (let i in engagementCategories) {
      if (!!engagementCategories[i] && !!engagementCategories[i]?.updatedScore) {
        updatedScores.push(engagementCategories[i]?.updatedScore)
      }
    }
    if (updatedScores.length > 0) {
      let result = await sendEngagementCategoryRequestAction("emp/score", updatedScores);
      if (result.status.toLowerCase() == "ok") {
        let variant = "success";
        enqueueSnackbar("Score Submitted", { variant });
      } else if (result.status.toLowerCase() == "error") {
        let variant = "error";
        enqueueSnackbar(`Error: Could not submit`, {
          variant,
        });
      }
    }
    await updateEngagement(dispatch);
  }
  const handleClearAll = () => {
    let record = commentList.map(obj =>{
      let newObj = { ...obj.comments, comment:'' }
      let newItem = { ...obj, updatedComments: newObj}
      return newItem
    });
    setCommentList(record);
    dispatch(setEngagementCategory(record))
    // let updatedComments = record.map(item=> item.updatedComments);
  }
  return (
    <>
      {!!code ?
        <Button 
          className="commentButton"
          onClick={() => { setActive(!!active ? false : true) }}
          sx={{
            minHeight: "42px",
            width: "100%",
            fontSize: "15px",
            color: "#000",
            borderRadius: "0",
            textTransform: "capitalize",
          }}
        >
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
          Comment
        </Button> :
        engagementCategories.length > 0 &&
        <div>
          <Button 
          variant="contained" className="btn-primary ml-2"
            onClick={() => { setActive(!!active ? false : true) }}
          >
            Add Comment & Submit
          </Button>
        </div>
      }
      <Modal
        open={active}
        onClose={() => { setActive(false) }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
        className="customPopup"
      >
        <Fade in={active}>
          <Box sx={style}>
            <Card
              sx={{
                boxShadow: "0px 2px 12px #00000065;",
                borderRadius: "10px",
              }}
            >
              <div className="popupHeader">
                <h4>Add comment {`(${title})`}</h4>
                <IconButton aria-label="close" onClick={() => { setActive(false) }}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
              <CardContent
                sx={{ p: "0px 20px 20px" }}
                className="commentBoxWrap"
              >
                {
                  commentList.map((item, index) => (
                    <div key={index}>
                      <RenderComments item={item} globalSet={(value) => { handleComment(value) }} setActive={setActive}
                        code={code} />
                    </div>
                  ))
                }
              </CardContent>
              {!code &&
              <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                <Stack 
                    className="comments-popup-btn-wrap"
                  >
                      <Button 
                        variant="text"
                        className="btn-text"
                        disableRipple
                        type="reset"
                        onClick={handleClearAll}
                      > 
                        Clear All
                      </Button>
                      <Button  variant="contained" className="btn-primary ml-2" onClick={handleSubmitComments}>
                        Submit
                      </Button>
                  </Stack>
                </Box>
                }
            </Card>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}