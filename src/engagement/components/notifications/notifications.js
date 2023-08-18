import React, { useEffect, useState } from "react";
import "./notifications.scss";
import { Card ,CardHeader ,CardContent ,Typography ,Box ,Avatar ,Stack ,List ,ListItem ,ListItemText ,ListItemAvatar ,Chip ,LinearProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { EmployeeComment } from "../../../commonComponents/modals/modals";
import { useDispatch, useSelector } from "react-redux";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import moment from "moment";
import * as _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import sendRequestAction from "../../actions/sendRequestAction";
import { useSnackbar } from "notistack";
import { setManagerNotification } from "../../reducer/managerNotificationList";
import { setAdminNotification } from "../../reducer/adminNotificationList";

 
 
const Notifications = ({loading, hasNextPage, error, loadMore, loadingBarStatus}) => {
  const { adminEmployeesCardList } = useSelector(state => state.adminEmployeesCardList);
  const { ManagerDownlineList } = useSelector((state) => state.engagementCategory);
  const { managerNotification } = useSelector(state => state.managerNotification);
  const { adminNotification } = useSelector(state => state.adminNotification);
  const { engagementCategoryList } = useSelector((state) => state.engagementCategory);
  const { graphProfileUrl } = useSelector((state) => state.graphProfileUrl);
  const [getGraphProfileURLS,setGraphProfileURL] = useState([]);
  const { pathname } = useLocation();
  const [getDownlineList,setDownlineList] = useState([]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { teamsAuthStatus } = useSelector((state) => state.teamsAuthStatus);

  const [getNotification,setNotification] = useState([]);
  const [getManagerDownline,setManagerDownline] = useState();
  const [getEngagementCategory,setEngagementCategory] = useState();
  const [getNotificationTime,setNotificationTime] = useState(0);
  
  useEffect(()=>{
    if(graphProfileUrl != null && graphProfileUrl?.length > 0){
      setGraphProfileURL(graphProfileUrl)
    }
  },[graphProfileUrl])


  useEffect(()=>{
    if(pathname === '/manager-dashboard'){
      setDownlineList(ManagerDownlineList);
    }
  },[ManagerDownlineList]);
  
  useEffect(()=>{
    if(pathname === '/admin-dashboard'){
      setDownlineList(adminEmployeesCardList);
    }
  },[adminEmployeesCardList]);

  const navigate = useNavigate();
  const notificationStateUpdate = () => {
    let notificationSelect = pathname == '/admin-dashboard' ? adminNotification : managerNotification;

    setNotification(notificationSelect.filter(item=>
      ((item.type == 'target' || item.type == 'engagement') && item.name != null) || (item.type == 'pulse' || item.type == 'comment'))
      )
  }
  useEffect(()=>{
    notificationStateUpdate();
  },[managerNotification, adminNotification])

 
  useEffect(()=>{    
    setManagerDownline(ManagerDownlineList)
  },[ManagerDownlineList])
  useEffect(()=>{  
    setEngagementCategory(engagementCategoryList)
  },[engagementCategoryList])

  useEffect(()=>{
    if(teamsAuthStatus ==  false){
      const timer = window.setInterval(() => {
        setNotificationTime(prevTime => prevTime + 1);
      }, 60000);
      return ()=> {
        window.clearInterval(timer);
      }
    }
  },[teamsAuthStatus])

  useEffect(()=>{
    if(getNotificationTime > 0){
      loadMore('new');
      }
  },[getNotificationTime])

  const [notificationLoadRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: '0px 0px 400px 0px',
  });

  function stringAvatar(name) {
    if(!!name && name != undefined){
    return {children : name.split(",").reverse().map(item=>item.trim().slice(0,1)).join("")}
  }else{
    return "N/A"
  }
  }
  const renderProfileImg = (data = null) => {
    if(data != undefined){
      if(pathname === '/admin-dashboard'){
        let getImage = getGraphProfileURLS?.find(item=>item.employee_id == data.employee_id);
        return (Object.keys(getImage || {})?.length > 0 && getImage?.src != null) ? 
          <Avatar className={`${getImage?.colorPalette}`} alt={getImage?.name} src={getImage?.src}  /> 
          : 
          <Avatar className={`${getImage?.colorPalette}`} {...stringAvatar(data?.name)} />
      }else{
          let imageUrl = getManagerDownline.find(item=>item.ms_username == data.ms_username);        
          if(imageUrl != undefined){
            let src = imageUrl.src;
            return (JSON.stringify(src) != 'null') ? 
            <Avatar className={`${imageUrl?.colorPalette}`} alt={imageUrl.name} src={imageUrl.src} />
            : <Avatar className={`${imageUrl?.colorPalette}`} {...stringAvatar(imageUrl.name)} />
          }
      }
    }
    return <Avatar {...stringAvatar("Not Available")} />
    
  }
  const dispatch = useDispatch();
  const handleUpdateCommentStatus = async (element) => {
   try{ 
    if(element){
      let apiURL = pathname === '/admin-dashboard' ? 'admin/readcomment' : 'mgr/readcomment';
      let update = await sendRequestAction(`${apiURL}/${element}`);
      if(update?.status.toLowerCase() == 'ok'){
        let setStatusRead = getNotification.map(item=>
          {
            if((item.pulse_comment_id) == element){
              return pathname == '/admin-dashboard' ? {...item,pulse_comment_read_admin:1} : {...item,pulse_comment_read:1}
            }
            return item;
          }
        )
        if(pathname === '/admin-dashboard'){
          dispatch(setAdminNotification(setStatusRead))
        }else{
          dispatch(setManagerNotification(setStatusRead))
        }
      }
    }
    }catch(err){
      // console.log("Error : "+err.message)
  }
  }
  return (
    <>
      <Card className={`${pathname === '/admin-dashboard' ? 'notifications-wrapper admin' : 'notifications-wrapper'}`}>
        <CardHeader title="Notifications" />
        <CardContent className={(!!loading  & getNotification.length == 0) ? " notEnoughDataWrap " : null} >
          <List className="change-tracking-list">
          {/* getGraphProfileURLS = {getGraphProfileURLS?.length} */}
            {getNotification?.map((data, i) => (
              <div key={i}>
                <ListItem >
                  <Stack className="notifications-user">
                    <ListItemAvatar sx={{cursor:'pointer',width:'54px',marginRight:'10px',borderRadius:'50%'}} onClick={()=> (data.user_info.employee_id != undefined || data.user_info.employee_id != null) ? 
                      navigate(`${pathname == '/admin-dashboard' ? '/admin/profile/' : '/profile/'}${data.user_info.employee_id}`) : null}>
                      {
                        renderProfileImg(data.user_info)
                      }
                    </ListItemAvatar>
                    <ListItemText primary={data.user_info.name.split(",").reverse().join(" ")} secondary={moment(data?.created_at).format('MM/DD/YY')} />
                  </Stack>
                  <Stack className={`notifications-details ${(data.type !== 'comment' && (data.previous_value > data.current_value))&& ' lower-score '}`}>
                    {/* <Stack className={`notifications-details ${((data.type == 'comment' ? data.previous_score : data.previous_value) > (data.type == 'comment' ? data.current_score : data.current_value)) && ' lower-score '}`}></Stack> */}
                    <Box
                      component="span"
                      className={
                        data.current_value < data.previous_value
                          ? "details-left low-score"
                          : "details-left"
                      }
                    >
                      {((data.type == 'comment' || (data.type == 'comment' ? data.current_score : data.current_value) < (data.type == 'comment' ? 
                              data.previous_score : data.previous_value)) 
                              ) && (
                        <>
                        
                        {((data.type == 'comment' && (pathname == '/admin-dashboard' ? data.pulse_comment_read_admin : data.pulse_comment_read) == 0 ) || data.type != 'comment') && <FontAwesomeIcon icon={faExclamation} />}
                         </>
                      )}
                     {/* {(data.type !== 'comment' && (data.current_score < data.previous_score)) && <FontAwesomeIcon icon={faExclamation} />}  */}
                      {/* <FontAwesomeIcon icon={faExclamation} /> */}

                      {/* <Typography variant="h6">{(data.type == 'pulse' || data.type == 'comment') ? 'Weekly Pulse' : (getEngagementCategory?.find(item=>item.code == data.name)?.name)}</Typography> */}
                      {data.type !== 'comment' && <Typography variant="h6">{(data.type == 'pulse') ? 'Weekly Pulse' : (getEngagementCategory?.find(item=>item.code == data.name)?.name)}</Typography>}
                      {/* {(pathname == '/admin-dashboard' ? data.pulse_comment_read_admin : data.pulse_comment_read) == 0 ? 'Not Read' : 'Read'} */}
                      {
                        (data.type == 'comment' && data.previous_score != null) && 
                        <EmployeeComment 
                          className={'notification_comment'}
                          triggerClickEvent={
                            () =>{
                              if((pathname == '/admin-dashboard' ? data.pulse_comment_read_admin : data.pulse_comment_read) == 0){
                                handleUpdateCommentStatus(data?.pulse_comment_id)
                              }
                            }
                          }
                          pulse_comment={{
                            id: data.pulse_comment_id,
                            comment: data?.comment,
                            comment_time: moment(data?.created_at).format('YYYY/MM/DD HH:mm:ss'),
                            category: 'Weekly Pulse',
                          }} 
                          data={{
                            // btnText: "(Comment Added)",
                            btnText: "Pulse Comment",
                          }} 
                          
                        />
                      }
                      {(data.type == 'target' && data.previous_value != null )&& 
                        <Typography className={'notification_comment'}>(Target)</Typography>
                      }
                      {
                        (((data.type == 'comment' ? data.previous_score : data.previous_value) == null) && data.comment == undefined)  && 
                        <Typography className={'notification_comment'}>{`(${'New'}${data.type == 'target' ? ' - Target' : ''}${data.type == 'engagement' ? ' - Current' : ''})`}</Typography>
                      }
                    </Box>
                    {
                    // ((data.type == 'comment' && data.previous_score != null) || data.type != 'comment' ) 
                    (data.type != 'comment' ) 
                    && 
                    <Box component="span" className="details-right">
                      {
                        ((data.type == 'comment' ? data.previous_score : data.previous_value) != null) && 
                        <Typography>{data.type == 'comment' ? data.previous_score : data.previous_value} to</Typography>
                      }
                      <Chip
                        label={data.type == 'comment' ? data.current_score : data.current_value}
                        color="primary"
                        className={
                          (data.type == 'comment' ? data.previous_score : data.previous_value) != null ? 
                            ((data.type == 'comment' ? data.current_score : data.current_value) < (data.type == 'comment' ? 
                              data.previous_score : data.previous_value) ? "red" : "green") : 
                            "black"
                        }
                      />
                    </Box>
                    }
                    { 
                      (data.type == 'comment' && data.previous_score == null) && 
                      <Box component="span" className="details-right-comment">  
                          <EmployeeComment 
                            triggerClickEvent={
                              () =>{
                                if((pathname == '/admin-dashboard' ? data.pulse_comment_read_admin : data.pulse_comment_read) == 0){
                                
                                  handleUpdateCommentStatus(data?.pulse_comment_id)
                                }
                             
                              }
                            }
                            handleOpenClick={data}
                            className={'notification_comment'}
                            pulse_comment={{
                              id: data.pulse_comment_id,
                              comment: data?.comment,
                              comment_time: moment(data?.created_at).format('YYYY/MM/DD HH:mm:ss'),
                              category: 'Weekly Pulse',
                            }} 
                            data={{
                              btnText: "(Comment Added)",
                            }} 
                          />
                      </Box>
                    }
                  </Stack>
                </ListItem>
              </div>
            ))}
            
            {!loading && hasNextPage ? (
                <ListItem  
                ref={notificationLoadRef} 
                className="loadMore-wrapper" sx={{display:'block !important'}}
                  >
                  <Stack className="notifications-user">

                  </Stack>
                  <Stack>
                    <Box>
                      <LinearProgress />
                    </Box>
                  </Stack>
                    
               
                </ListItem>
              ) :
              loadingBarStatus ? (
                <ListItem  
                  className="loadMore-wrapper" sx={{display:'block !important'}}
                  >
                  <Stack className="notifications-user">

                  </Stack>
                  <Stack>
                    <Box>
                      <LinearProgress />
                    </Box>
                  </Stack>
                    
               
                </ListItem>
              )
              :
              ""
            }
              
          </List>
          {(!!loading  && getNotification.length == 0 && !loadingBarStatus ) ? <div className="notEnoughData ">No Notifications</div> : null}
        </CardContent>

      </Card>
    </>
  );
};

export default Notifications;
