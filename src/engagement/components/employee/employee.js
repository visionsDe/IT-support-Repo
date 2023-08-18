import React from "react";
import "./employee.scss";
import {Avatar ,Button ,Typography ,Box ,Skeleton} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import Slider from "../range-slider/range-slider";
import { useLocation ,useNavigate, useParams } from 'react-router-dom'
import { EmployeeComment, PerformanceNote } from "../../../commonComponents/modals/modals";
import Cookies from 'universal-cookie';
import { useSelector ,useDispatch } from "react-redux";
import { addPerformanceNoteAction} from "../../actions/performanceNoteAction";
import { useSnackbar } from "notistack";
import { chat } from "@microsoft/teams-js";

import sendRequestAction from "../../actions/sendRequestAction";
import { setManagerNotification } from "../../reducer/managerNotificationList";
import { setIndividualEmployeeProfileData } from "../../reducer/engagementPillars";

const Employee = ({ data ,graphClient ,getDiscussionList ,profileImageLoading }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { id } = useParams();
  const cookies = new Cookies();
  const dispatch = useDispatch()
  const {engagementCategory} = useSelector((state) => state);
  const { graphProfileUrl } = useSelector((state) => state.graphProfileUrl);
  let profileCookie = (!!cookies.get("profile", { secure: true, sameSite:'none' })&& cookies.get("profile", { secure: true, sameSite:'none' })!= undefined) ?cookies.get("profile", { secure: true, sameSite:'none' }):""
  const [getGraphProfileURLS,setGraphProfileURL] = React.useState([]);
  React.useEffect(()=>{
    if(graphProfileUrl != null && graphProfileUrl?.length > 0){
      setGraphProfileURL(graphProfileUrl);
    }
  },[graphProfileUrl])
  function stringAvatar(name) {
    if(!!name && name != undefined){
      return {children : name.split(",").reverse().map(item=>item.trim().slice(0,1)).join("")}
  }else{
    return {children : "N/A"}
  }
  }
  const handleOpenMeeting =() => {
    if(!!profileCookie && profileCookie.employee_id != id){
    window.open(`https://teams.microsoft.com/l/call/0/0?users=${engagementCategory?.individualEmployeeProfileData?.ms_username}&withvideo=true`, "_blank")
    }
    else{
      window.open(`https://teams.microsoft.com/l/call/0/0?users=${engagementCategory?.employeeProfileData?.manager_ms_username}&withvideo=true`, "_blank")
    }
  }
  const handleOpenEmpMeeting = () => {
    window.open(`https://teams.microsoft.com/l/call/0/0?users=${engagementCategory?.employeeProfileData?.manager_ms_username}&withvideo=true`, "_blank")
  }
  const location = useLocation();
  let navigate = useNavigate();
  const handleFormSubmit = async (element) =>{
    try{
      let payload = {
        text:element
      }
      let result = await addPerformanceNoteAction(`mgr/note/${id}`,payload);
      if(result){
        let variant = 'success';
        enqueueSnackbar('Performance Note Added', {variant});
      }
    }catch(err){
      let variant = 'error';
      enqueueSnackbar('Error: '+err.message, {variant});
    }     
  }

  const {individualEmployeeProfileData} = useSelector((state) => state.engagementCategory);
  const { managerNotification } = useSelector(state => state.managerNotification);
  const handleUpdateCommentStatus = async (element) => {
  try{ 
    if(element){
      let selectedUrl = (location.pathname == '/admin-dashboard' || location.pathname.match('/admin/profile')) ? 'admin/readcomment' : 'mgr/readcomment';
      let update = await sendRequestAction(`${selectedUrl}/${element}`);
      if(update?.status.toLowerCase() == 'ok'){
        let setNotificationReadStatus = managerNotification.map(item=>
          {
            if(item.pulse_comment_id == element){
              return (location.pathname == '/admin-dashboard' || location.pathname.match('/admin/profile')) ? {...item,pulse_comment_read_admin:1} : {...item,pulse_comment_read:1}
            }
            return item;
          }
        )
          let updateObject = (location.pathname == '/admin-dashboard' || location.pathname.match('/admin/profile')) ? {pulse_comment_read_admin:1} : {pulse_comment_read:1}
          let setProfileReadStatus = {...individualEmployeeProfileData, ...updateObject};
          dispatch(setIndividualEmployeeProfileData(setProfileReadStatus));
          dispatch(setManagerNotification(setNotificationReadStatus))
      }
    }
    }catch(err){
      // console.log("Error : "+err.message)
  }
  }
  const renderProfileImage = (data = null) => {
    if(data != undefined){
      let getImage = getGraphProfileURLS?.find(item=>item.employee_id == data?.employeeId);
      return (Object.keys(getImage || {})?.length > 0 && getImage?.src != null) ? 
      <Avatar className={`customAvatar ${getImage?.colorPalette}`} alt={getImage?.name} src={getImage?.src} /> 
      : 
      <Avatar className={`customAvatar ${getImage?.colorPalette}`} {...stringAvatar(getImage?.name != undefined ? getImage?.name : data?.name)} />
    }
    return <Avatar className={`customAvatar`} {...stringAvatar("Not Available")} />
  }
  const renderProfileImageSecond = (data = null) => {
    if(data != null){
      if(data.src == null || data.src == ''){
        let graphPalette = getGraphProfileURLS?.find(item=>item.employee_id == data?.employeeId)?.colorPalette;
        let getColorPalette =  graphPalette != undefined ? graphPalette : data.colorPalette;
        return <Avatar className={`customAvatar ${getColorPalette != undefined ? getColorPalette:'paletteColor1'}`} {...stringAvatar(data?.name)} />
      }else{
        return <Avatar className={`customAvatar ${location.pathname === '/manager-dashboard' ? data.colorPalette : getGraphProfileURLS?.find(item=>item.employee_id == data?.employeeId)?.colorPalette}`} {...stringAvatar(data?.name)} />
      }
    }
    return <Avatar className={`customAvatar paletteColor1`} {...stringAvatar("Not Available")} />
  }
return (
    <>
      <Box>
        <div className="profileInfoWrap">
          { 
            (location.pathname !== '/admin-dashboard' ? (data?.src != null && data?.src != '' && data?.src != 'undefined' && !profileImageLoading ) ? (
              <Avatar className={`customAvatar ${location.pathname === '/manager-dashboard' ? data.colorPalette : getGraphProfileURLS?.find(item=>item.employee_id == data?.employeeId)?.colorPalette}`} alt={data?.name} src={data?.src} />
            ) : (
              (!!data?.name && !profileImageLoading && !data?.src )?
              // <Avatar className={`customAvatar ${location.pathname === '/manager-dashboard' ? data.colorPalette : getGraphProfileURLS?.find(item=>item.employee_id == data?.employeeId)?.colorPalette}`} {...stringAvatar(data?.name)} />
              renderProfileImageSecond(data)
              :
              <Skeleton className="MuiAvatar-root" variant="circular"  />
            ) : 
            renderProfileImage(data)
            )
          }

          {/*****************Employee Name start *****************/}
          <Typography className="employeeName" variant="h6" sx={{ marginTop: "15px" }}>
            { data.name != undefined ? 
            data.name.split(',').reverse().join(" ") 
            : <Skeleton variant="rectangular" width={"100%"} height={"40px"} />  }
          </Typography>
          {/*****************Employee Name end *****************/}

          {/*****************Job title start *****************/}
          {location.pathname == '/employee-dashboard' && 
            <p className="jobTitle">
              { data.jobTitle != '' ? data.jobTitle : <Skeleton variant="rectangular" sx={{ marginTop: "15px" }} width={"100%"} height={"20px"} />   }
            </p> 
          }
          {/*****************Job title end *****************/}
          
          {(location.pathname != '/employee-dashboard') &&
            <>
            
            {(location.pathname != '/manager-dashboard' && location.pathname != '/admin-dashboard') ? 
            <p className="jobTitle">
                { data.jobTitle != '' ? data.jobTitle : <Skeleton variant="rectangular" sx={{ marginTop: "15px" }} width={"100%"} height={"20px"} />   }
            </p> : ''
            }
            {(location.pathname == `/profile/${data?.employeeId}` || location.pathname == `/admin/profile/${data?.employeeId}`) &&
              <>
                <Slider 
                settings={data.settings} 
                customClass={`${data.currentWeekScore <= 5 ? ' error-slider ' : ''} ${(!data.settings.defaultValue && data.settings.defaultValue == undefined || data.settings.defaultValue == null ) ? ' value_none ' : ' '}`} 
                />
                <div className="font14"><strong className="">Weekly Pulse</strong></div>
              </>
              }
            </>
          }


          {(location.pathname == '/manager-dashboard' || location.pathname == '/admin-dashboard') &&
            <>
              <Slider 
              settings={data.settings} 
              customClass={`${data.currentWeekScore <= 5 ? ' error-slider ' : ''} ${(!data.settings.defaultValue && data.settings.defaultValue == undefined || data.settings.defaultValue == null ) ? ' value_none ' : ' '}`} 
              />
              <div className="font14"><strong className="">Weekly Pulse {data?.currentWeekScore}</strong></div>
              {(data.lastWeekScore == undefined && data.lastWeekScore == null) ? 
                <span className="previousInfo">Previous: Not Submitted</span> 
                  : 
                <span className="previousInfo">Previous: {data.lastWeekScore} ({data.currentWeekScore - data.lastWeekScore >= 0 && '+'}{data.currentWeekScore - data.lastWeekScore})</span>
              }
              
            </>
          }
          {(location.pathname.match('profile') || location.pathname.match('/admin/profile')) &&
            <EmployeeComment 
              triggerClickEvent={
                  ()=>
                  {
                    if(data.pulse_comment_read == 0){
                      handleUpdateCommentStatus(data?.pulse_comment_id)
                    }
                }
              }
              pulse_comment={ {
              id: data.pulse_comment_id,
              comment: data.pulse_comment,
              comment_time: data.pulse_comment_time,
              comment_status: data.pulse_comment_read,
              category: "Weekly Pulse",
            }}
            />
           
          }

           
        </div>
        <div className="profileButtonsWrap">


         {/***************** View Conversation Button Start *****************/}
          {(location.pathname != '/employee-dashboard' && location.pathname != '/recognition/manager-dashboard' && location.pathname != '/recognition/employee-dashboard') && 
            <Button
              variant="outlined"
              className="btn-primary btn-border"
              disabled={data.ms_identifier? false : true} 
              onClick={
                ()=>
                {
                  if(chat.isSupported()) {
                    const chatPromise = chat.openGroupChat({ users: [data.ms_username]});
                    chatPromise.then((result) => {/*console.warn('Successful operation ', result)*/}).catch((error) => {console.error('Unsuccessful operation ', error)});
                  }
                }

                } >
              View Conversation
            </Button>

          }

          {location.pathname == '/employee-dashboard' &&
            <Button 
            variant="outlined"
            className="btn-primary btn-border"
            disabled={(!!data.ms_identifier && !!data.manager_ms_username)? false : true} 
              onClick={()=>
               {
                  if(chat.isSupported()) {
                  const chatPromise = chat.openGroupChat({ users: [data.manager_ms_username]});
                  chatPromise.then((result) => {/*console.warn('Successful operation ', result)*/}).catch((error) => {console.error('Unsuccessful operation ', error)});
                  }
                }
              } >
            View Conversation
          </Button> }

        
         
          {/***************** View Conversation Button End *****************/}


          {(location.pathname == '/manager-dashboard' || location.pathname == '/admin-dashboard') &&
            <Button  variant="contained" className="btn-primary" onClick={()=> navigate(location.pathname.match('/admin-dashboard') ? `/admin/profile/${data.employeeId}` : `/profile/${data.employeeId}`)}>Profile</Button>
          }
          
          {(location.pathname != '/manager-dashboard' && location.pathname != '/admin-dashboard' && location.pathname != '/employee-dashboard' && location.pathname != '/recognition/manager-dashboard' && location.pathname != '/recognition/employee-dashboard') &&
            <Button
              variant="contained"
              className="btn-primary"
              endIcon={<VideocamIcon />}
              disabled={!!data.ms_username? false : true}
              onClick={() => handleOpenMeeting()}
            >
              Start Meeting
            </Button>
          }
              {location.pathname == '/employee-dashboard' &&
             <Button 
             variant="contained"
             className="btn-primary"
             endIcon={<VideocamIcon />}
             disabled={(!!data.ms_identifier && !!data.manager_ms_username)? false : true}
             onClick={() => handleOpenEmpMeeting()}
           >
             Start Meeting
           </Button> } 
          {(!location.pathname.match('/admin/profile',  { secure: true, sameSite:'none' }) && location.pathname.match('profile', { secure: true, sameSite:'none' })) &&
            <PerformanceNote handleSubmit={handleFormSubmit}/> 
          }
        </div>
      </Box>
    </>
  )
};

export default Employee;
