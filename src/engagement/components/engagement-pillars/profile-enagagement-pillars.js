import React, {useState } from "react";
import "./engagement-pillars.scss";
import {Box} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useSelector } from "react-redux";
import * as _ from "lodash";
import { ProfilePillarCard } from "./profilePillarCard";


const ProfileEngagementPillars = () => {
  const [open,setOpen] = useState('');

  const {individualEmployeeProfileData} = useSelector((state) => state.engagementCategory);
  const [getToolTipIndex,setToolTipIndex] = useState(null);
 return (
    <>
      <Box className="engagement_pillars-wrapper">
        <ClickAwayListener
          onClickAway={() => {
            setOpen("");
          }}
        >
          {individualEmployeeProfileData?.updateCategories?.length > 0 ? (
            <Box className="engagementPillar-sliderWrapper">
              {_.sortBy(individualEmployeeProfileData?.updateCategories, "sort")?.map((item, index) => 
              <div key={index}>
                <ProfilePillarCard
                  data={item}
                  index={index}
                  tooltipEvent={(element)=>{setToolTipIndex(element)}}
                  activeTooltip={getToolTipIndex}
                /> 
              </div>
                  )
                }
              </Box>)
            :
              <Box className="engagementPillar-sliderWrapper">
                {[1,2,3,4,5,6,7,8,9].map((item,i) => <ProfilePillarCard key={i} data={''} index={''} /> )}
              </Box>
               } 
        </ClickAwayListener>
      </Box>
    </>
  );
};

export default ProfileEngagementPillars;
