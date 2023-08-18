import React, { useEffect, useState } from 'react'
import { Stack, Typography, Grid, Slider, Button, ListItem, List, Avatar, Skeleton, } from "@mui/material";
import './TargetDescription.scss';
import CommentHistory from '../popups/commentHistory';
import TargetComplete from '../popups/TargetComplete';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Cookie from "js-cookie";
import { useLocation } from 'react-router-dom';

    function TargetDescription({data, addNewTargetComment = () => {}, handleProgressSubmitEvent = () => {}, handleTargetSubmitEvent = () => {}, updateTargetComment = () =>{}, updateSelectedCommentList = () => {}, removeCommentEvent = () => {}, updatedTargetCommentID}) {
    const [employeeListWithComments, setEmployeeListWithComments] = React.useState([]);
    const { pathname } = useLocation();
    const { userInfo } = useSelector(state => state.recognitionDashboard);
    const { graphProfileUrl } = useSelector(state => state.graphProfileUrl)
    const [getGraphProfileURLS,setGraphProfileURL] = React.useState([]);
    const role = Cookie.get('role',{ secure: true, sameSite:'none' });
    React.useEffect(()=>{
      if(graphProfileUrl != null && graphProfileUrl?.length > 0){
        setGraphProfileURL(graphProfileUrl);
      }
    },[graphProfileUrl])
    React.useEffect(()=>{
        setEmployeeListWithComments(data);
    },[data]);
    const [value, setValue] = React.useState(null);
    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setValue(newValue);
        }
    };

    const stringAvatar = (name) => {
        if(!!name && name != undefined){
            return {children : name.split(",").reverse().map(item=>item.trim().slice(0,1)).join("")}
        }else{
            return {children : "N/A"}
        }
    }
    const handleSubmitComment = async (data) => {
        addNewTargetComment(data, employeeListWithComments?.target_id)
    }

    const handleUpdateComment = async (comment_id,comment) => {
        updateTargetComment(comment,comment_id,employeeListWithComments?.target_id);
    }

    const renderProfileAvatar = (data) => {
        return(
            data?.src != null ?
            <Avatar
                sx={{ width: "40px", height: "40px" }}
                className={`${data?.colorPalette}`} 
                alt={data?.name} 
                src={data?.src}
           /> :
            <Avatar className={`${data?.colorPalette}`} {...stringAvatar(data?.name != undefined ? data?.name : data?.name)} />
        )
      }
        const handleTargetApproveSubmit = (employee_id) => {
            handleTargetSubmitEvent(employee_id, employeeListWithComments?.target_id);
        }
        const getETNow = (date) => {
            let dt;
              if(date){
                dt = new Date(`${date.trim().replace(' ','T')}+00:00`);
              }else{
                dt = new Date();
              }
              const options = { timeZone: 'America/New_York' };
              const etDateString = dt.toLocaleString('en-US', options);
              const easternNow = new Date(etDateString);
              return easternNow;
            }
    return (
        <Stack className='t-Description'>
            <Typography sx={{ mb: 1, textAlign: "center" }}><strong>Target Description: </strong></Typography>
            <Typography className='descriptionText' sx={{ textAlign: "center", margin:"0 auto 16px" }}>{employeeListWithComments.description}</Typography>
            <Typography sx={{ mb: 1, textAlign: "center" }}><strong>Reward: </strong><strong className='colorPrimary'>{employeeListWithComments?.points} Points</strong></Typography>
            <Typography sx={{ mb: 2, textAlign: "center" }}><strong>Due Date: </strong><strong className={((employeeListWithComments?.due_date != undefined && employeeListWithComments?.due_date != null) ? (new Date(employeeListWithComments.due_date).getTime() < new Date().getTime() ? "due" : 'colorPrimary') : 'colorPrimary')}>{(employeeListWithComments?.due_date != null && employeeListWithComments.due_date != "") ? moment(employeeListWithComments.due_date).format('DD/MM/yyyy') : 'N/A'}</strong></Typography>
            <Grid container spacing={2} columns={12}>
                <Grid item xs={6}>
                    <Typography sx={{ textDecoration: "underline" }}><strong>Employee</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography sx={{ textDecoration: "underline", textAlign: "right"}}><strong>Progress</strong></Typography>
                </Grid>
            </Grid>
            <List  
            className={`${employeeListWithComments?.assigned_employees?.length > 5 ? ' scrollable ' : ''}`}
            >
                { employeeListWithComments?.assigned_employees?.map((item, i) => (
                    <ListItem key={i}  className='targetRangeItem' sx={{ flexWrap:"wrap",pb:1, px:0}}>
                        <div className='empInfoWrap'>
                            <div className={`${getGraphProfileURLS?.find(data=>data.employee_id == item?.employee_id)?.src != null ? ' empAvatar ' : ' customAvatar ' } empInfo`}>
                                {
                                    ((Object.keys(getGraphProfileURLS?.find(data=>data.employee_id == item?.employee_id) || {})?.length > 0)) ? 
                                    renderProfileAvatar(getGraphProfileURLS?.find(data=>data.employee_id == item?.employee_id))
                                    :
                                    <Avatar {...stringAvatar(item?.full_name)}/>
                                }
                                <Typography sx={{fontSize:"14px", fontWeight:"600",lineHeight:"1.2"}}>{item.full_name != null ? item.full_name?.split(',')?.reverse()?.join(', ') : 'Not Available'}</Typography>
                            </div>
                            <div className='empScore'>
                                <Typography sx={{mb:0 }}> 
                                {
                                    (item.employee_id === userInfo?.employee_id && item?.progress !== null) ?
                                    (
                                        value !== null ? value : (item?.progress !== null ? item?.progress : '0')
                                    ) :
                                    (
                                        item?.progress !== null ? 
                                        item?.progress :
                                        '0'
                                    )
                                }

                                %</Typography>
                            </div>
                        </div>
                        <Stack className='targetSliderWrap' sx={{width:"100%" }} >

                        {/* {JSON.stringify(item?.progress)} */}
                            <Slider
                                className={"targetSlider " + (item?.progress == 100 ? 'full ' : '') + ( item.employee_id !== userInfo?.employee_id ? '' : 'selfSlider') }
                                aria-label="EmployeeTarget"
                                step={10}
                                marks
                                min={0}
                                max={100}
                                onChange={handleChange}
                                onChangeCommitted={(event, newValue)=>{
                                    handleProgressSubmitEvent(newValue)
                                }}
                                value={(item.employee_id === userInfo?.employee_id && item?.progress !== null) ?
                                    (
                                        value !== null ? value : (item?.progress !== null ? item?.progress : 0)
                                    ) :
                                    (
                                        item?.progress !== null ? 
                                        item?.progress :
                                        0
                                    )}
                                disabled={item.employee_id !== userInfo?.employee_id ? true : false}
                            />
                        </Stack>
                        {(item?.progress == 100 && pathname == '/recognition/manager-dashboard') && <Typography sx={{ mb: 1, textAlign: "left", fontSize:'11px' }}><strong>Completed: </strong> {moment(getETNow(item?.progress_time)).format('DD/MM/YYYY hh:mm:ss')}</Typography>}
                    </ListItem>
                )) }
            </List>
            <Stack className="descriptionBtnWrap">
                {role == '0' && 
                <CommentHistory
                    viewComments={false} 
                    commentsList={employeeListWithComments?.comments}
                    submitNewCommentEvent={handleSubmitComment} 
                    title={employeeListWithComments?.name} 
                    disabledCheckAdd={
                        employeeListWithComments?.assigned_employees?.filter(item => item.employee_id == userInfo?.employee_id)?.length == 0 ? true : false
                    }
                >
                     <Button
                        sx={{ mt: 2, boxShadow: "none" }}
                        variant="contained"
                        className="btn-primary btn-full"
                        disabled={employeeListWithComments?.assigned_employees?.filter(item => item.employee_id == userInfo?.employee_id)?.length == 0 ? true : false}
                    >
                        Add Comment
                    </Button> 
                </CommentHistory>
                }
                {employeeListWithComments?.comments != undefined ? 
                    <CommentHistory 
                        viewComments={true} 
                        commentsList={employeeListWithComments?.comments} 
                        title={employeeListWithComments?.name} 
                        submitNewCommentEvent={handleSubmitComment} 
                        submitUpdateCommentEvent={(comment_id,comment) => {handleUpdateComment(comment_id,comment)}} 
                        disabledCheck={
                            employeeListWithComments?.assigned_employees?.filter(item => item.employee_id == userInfo?.employee_id)?.length == 0 ? true : false
                        }
                        latestCommentID={updatedTargetCommentID}
                        removeCommentEvent={(comment_id) => removeCommentEvent(employeeListWithComments?.target_id, comment_id)}
                        updateSelectedCommentList={() => updateSelectedCommentList(employeeListWithComments?.target_id)}
                    > 
                    <Button
                        sx={{ mt: 2, boxShadow: "none" }}
                        variant="contained"
                        className="btn-border btn-full"
                        >
                        View Comments ({employeeListWithComments?.comments?.length}) 
                    </Button>
                    </CommentHistory>
                    : 
                    <Skeleton 
                        variant="rectangular" 
                        sx={{
                            minWidth: '174px',
                            minHeight: '45px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '10px 25px',
                            border: 'none',
                            fontSize: '14px',
                            borderRadius: '30px',
                            marginTop:'16px'
                        }}
                    />
                }
                {
                    (role == '1' || employeeListWithComments?.create_employee_id == userInfo?.employee_id) && 
                    <TargetComplete 
                        points={employeeListWithComments?.points} 
                        creator={employeeListWithComments?.create_employee_id} 
                        // data={employeeListWithComments?.assigned_employees?.filter(item => item?.progress == 100)} 
                        data={employeeListWithComments?.assigned_employees} 
                        handleTargetApproveEvent={handleTargetApproveSubmit} 
                    />
                }
            </Stack>
        </Stack>
    );
}




export default TargetDescription;