import * as React from 'react';
import {Typography} from "@mui/material";
import {Box,List,ListItemText,ListItemIcon,ListItem} from '@mui/material';
import badge from "../../commonAssets/images/badge.jpg";
import './YourBadge.scss'
import BadgeDetails from "./BadgeDetailsPopup"
import { useSelector } from 'react-redux';

function YourBadge() {
const [openBadge , setOpenBadge] = React.useState(null);
const { userInfo } = useSelector(state => state.recognitionDashboard);
const handleCloseBadge = () => {
  setOpenBadge(null)
}
const handleOpenBadge = (data) => {
  setOpenBadge(data)
}
    return (
      <Box className="yourBadgeWrap">
        <Typography color="primary" mb={1} sx={{fontWeight:"600", textAlign:"center"}}>YOUR BADGES</Typography>
        <List className={"badgeList " + (userInfo?.badges?.length > 9 && 'scrollable ') }>
            {userInfo?.badges?.map((item, index) => (
              <ListItem className={"badgeListItem" + (userInfo?.badges?.length < 3 && ' wider')} key={index} onClick={()=>handleOpenBadge(item?.id)}>
                  <ListItemIcon className="badgeImage">
                      <img src={item?.image_url != null ? item?.image_url : badge} alt={item.name} />
                  </ListItemIcon>
                  <ListItemText className="badgeTitle" primary={item.name} />
              </ListItem>
            ))}
          
        </List>
          <BadgeDetails 
            openBadge={openBadge != null ? true : false}
            data={userInfo?.badges?.find(item => item.id == openBadge)}
            handleCloseBadge = {handleCloseBadge}
            />
      </Box>
    );
  }
  
  
  
  
  export default YourBadge;