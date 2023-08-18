import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import {
  Box,
  IconButton,
  Modal,
  Fade,
  Paper,
  Button,
  TextField,
  Stack,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faXmark,
  faTrashCan,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import "./../../RecognitionPopup.scss";
import moment from "moment";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc(100% - 30px)",
  maxWidth: 1030,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "20px",
  p: 0,
};

function CommentHistory({ viewComments, commentsList, title, latestCommentID, submitNewCommentEvent = () =>{}, submitUpdateCommentEvent = () =>{}, updateSelectedCommentList = () => {}, removeCommentEvent = () => {}, disabledCheck = false, disabledCheckAdd = false, children}) {
  const [editValue, setEditValue] = React.useState(null);
  const [getCommentListData, setCommentListData] = React.useState([]);
   const [newCommentList, setNewCommentList] = React.useState([]);
  const [newComment,setNewComment] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { userInfo } = useSelector(state => state.recognitionDashboard)
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewComment(null);
    setOpen(false);
    updateSelectedCommentList()
  };
  React.useEffect(()=>{
    setCommentListData(commentsList);
  },[commentsList])

  React.useEffect(() => {
    if(latestCommentID != null){
      setNewCommentList(newCommentList?.filter(item => item?.id !== latestCommentID?.item_id));
      setCommentListData(
        getCommentListData?.map(
          item => 
          {
            return latestCommentID?.item_id == item?.id  ? 
            {...item,"comment_id":latestCommentID?.comment_id} : 
            {...item}
          }
        )
      )
    }
  },[latestCommentID])

  const [viewCommentsData, viewCommentsResults] = React.useState(viewComments);
  return (
    <div className="addTeamPopup">
     <span onClick={() => !disabledCheckAdd ? handleOpen() : ''}>{children}</span>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose();
          viewCommentsResults(viewComments);
        }}
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
            <div className="popupBody large">
              <IconButton
                className="grayClose"
                aria-label="close"
                onClick={handleClose}
              >
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
              <h4 className="headerTitle colorPrimary">Comment History</h4>
              <p className="headerTitleInfo colorPrimary">Target: {title}</p>
              <div className="historyTable">
                <table>
                  <thead>
                    <tr>
                      <th>COMMENTS</th>
                      <th>DATE</th>
                      <th>EMPLOYEE</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                    getCommentListData?.length > 0 &&
                      getCommentListData?.map((data, i) => (
                        <tr key={i}>
                          <td data-label="COMMENTS">
                            {data?.editable === true ? (
                              <>
                              <TextField
                                className="descriptionField"
                                variant="standard"
                                multiline
                                rows={1}
                                fullWidth
                                sx={{ border: "none" }}
                                placeholder="Your comment here"
                                value={data?.comment}
                                onChange={(element) => {
                                  let listCopy = getCommentListData?.map(item => {return item?.comment_id == data?.comment_id ? {...item,"comment":element.target.value} : {...item}});
                                  setCommentListData(listCopy);
                                }}
                              />
                              </>
                              ) : data?.comment
                            }
                          </td>
                          <td data-label="DATE">
                            <strong>{moment(data?.comment_time).format("MM/DD/YYYY")}</strong>
                          </td>
                          <td data-label="EMPLOYEE">
                            <strong>{data?.full_name}</strong>
                          </td>
                          <td>
                          {!disabledCheck && 
                            <Stack
                              className="tableActionBtn"
                              sx={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                              }}
                            >
                              {data?.editable === true ? (
                                <Tooltip title="Update Comment">
                                  <IconButton
                                    onClick={
                                        () => {
                                        if(data?.editable === true){
                                          submitUpdateCommentEvent(data?.comment_id, data?.comment);
                                          let listCopy = getCommentListData?.map(item => {return item?.comment_id == data?.comment_id ? {...item,"editable":false} : {...item}});
                                          setCommentListData(listCopy);
                                        }
                                      }
                                    }
                                  >
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <>
                                  {(data?.comment_id != null && data?.employee_id == userInfo?.employee_id) && 
                                  <IconButton
                                    onClick={() => {
                                        let listCopy = getCommentListData?.map(item => {return item?.comment_id == data?.comment_id ? {...item,"editable":true} : {...item}});
                                        setCommentListData(listCopy);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                  </IconButton>}
                                  {(data?.comment_id != null && data?.employee_id == userInfo?.employee_id) && 
                                    <IconButton onClick={() => {
                                      removeCommentEvent(data?.comment_id)
                                      let listCopy = getCommentListData?.filter(item => item?.comment_id != data?.comment_id);
                                      setCommentListData(listCopy);
                                    }}>
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </IconButton>
                                  }
                                </>
                              )}
                            </Stack>}
                          </td>
                        </tr>
                      ))
                      
                    }
                    {
                      (newCommentList?.length == 0 && getCommentListData?.length == 0) && 
                      <tr>
                        <td colSpan={4} style={{textAlign:"center"}}>No Comment Found</td>
                      </tr>
                    }
                    {newCommentList?.map((item, index) => 
                      <tr key={item?.id}>
                        <td data-label="COMMENTS">
                          <TextField
                            className="descriptionField"
                            variant="standard"
                            multiline
                            rows={1}
                            fullWidth
                            sx={{ border: "none" }}
                            placeholder="Your comment here"
                            value={item?.comment}
                            onChange={(element) => {
                              let latestNewCommentList = newCommentList.map(itemChild => {
                                return itemChild?.id == item?.id ? {...itemChild, "comment":element?.target?.value} : {...itemChild}
                              })
                              setNewCommentList(latestNewCommentList);
                            }}
                          />
                        </td>
                        <td data-label="DATE">
                          <strong>
                            {moment(new Date()).format("MM/DD/YYYY")}
                          </strong>
                        </td>
                        <td data-label="EMPLOYEE">
                          {" "}
                          <strong>
                            {JSON.parse(Cookies.get("userProfile"))?.name}
                          </strong>
                        </td>
                        <td>
                          {!disabledCheck && 
                          <Stack
                            className="tableActionBtn"
                            sx={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Tooltip title="Save Comment">
                              <IconButton>
                                <FontAwesomeIcon 
                                  icon={faFloppyDisk} 
                                  onClick={() => {
                                    if(item?.editable == undefined || item?.editValue == null || item?.editValue == false ){
                                      submitNewCommentEvent({"item_id":item?.id, "comment":item?.comment});
                                      setNewCommentList([...newCommentList.filter(comment => comment.id != item?.id)]);
                                      setCommentListData([...getCommentListData, item]);
                                    }
                                  }} 
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>}
                        </td>
                      </tr>
                    )
                    }
                  </tbody>
                </table>
              </div>
              <div className="popupBtnWrap">
                <Button
                  variant="contained"
                  className="btn-border btn-md"
                  sx={{ minWidth: "185px" }}
                  onClick={() => {
                    handleClose();
                    viewCommentsResults(viewComments);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  sx={{ ml: 1, width: "185px" }}
                  className="btn-primary btn-md"
                  disabled={disabledCheck}
                  onClick={() => {
                    viewCommentsResults(false);
                    let today = new Date();
                    let addListNewCommentList = {
                      "id": `${today.getTime()}-${Math.floor(Math.random() * 100)}`,
                      "employee_id": userInfo?.employee_id,
                      "full_name": JSON.parse(Cookies.get("userProfile"))?.name,
                      "comment": null,
                      "comment_time": today,
                      "comment_id": null,
                      "editable": false
                    };
                    setNewCommentList([...newCommentList,addListNewCommentList]);
                  }}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default CommentHistory;
