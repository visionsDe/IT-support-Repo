import React from 'react'
import {Typography} from "@mui/material";
import {Button, Box} from '@mui/material';
import './YourPoints.scss'
import { useDispatch, useSelector  } from "react-redux";
import { setDashboardTab } from "../reducer/recognitionDashboardReducer";

function YourPoints() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.recognitionDashboard)
  
    return (
      <Box className="YourPointsWrap" >
        <Typography mb={0} >YOUR POINTS:</Typography>
        <Typography mb={0} className={'pointScore'}>{userInfo?.points != null ? userInfo?.points : '0'}</Typography>
        <Button disabled={true} onClick={()=> dispatch(setDashboardTab("RedeemPoints"))} variant="text" className={'btn-text redeem-button'} sx={{padding:"0px", color:"#fff"}}>Redeem</Button>
      </Box>
    );
  }
  
  
  
  
  export default YourPoints;