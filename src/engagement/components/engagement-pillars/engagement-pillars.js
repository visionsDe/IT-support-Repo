import React, { useEffect, useMemo, useState } from "react";
import "./engagement-pillars.scss";
import {Box ,Button} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useSelector, useDispatch } from "react-redux";
import { updateEngagement } from '../../helper/helper'
import {sendEngagementCategoryRequestAction} from "../../actions/engagement";
import { setEngagementCategory } from "../../reducer/engagementPillars";
import { PillarCard } from "./pillarCard";
import * as _ from "lodash";
import { useSnackbar } from "notistack";

const EngagementPillars = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open,setOpen] = useState('');
const dispatch = useDispatch();

  // == ======= Getting Engagement Category List from Store == =======
  const {engagementCategories} = useSelector((state) => state.engagementCategory);

  useEffect(() => {
    updateEngagement(dispatch);
  }, []);
  const handleCallBackEvent = (element,changeType) => {
    if (_.isEmpty(element) ==  false) {
      let record = engagementCategories?.map((item) =>{
        if(item.code == element.code){
          if(changeType == 'score'){
            return {...item,score:element.score, updatedScore:item.score, updatedCurrent:item.score}
          }if(changeType == 'target'){
            return {...item,score:element.score, updatedScore:item.score, updatedTarget:item.score}
          }
          else if(changeType == 'comment'){
            return {...item,updatedComments:element.comments}
          }
        }
        return {...item}
      })
      dispatch(setEngagementCategory(record))
      if(changeType == 'score' || changeType == 'target'){
        let type = changeType == 'score' ? 'score' : 'target';
        let payload;
        changeType == 'score' ? payload = {
          "engagement_category" : element?.score?.engagement_category,
          'score' : element?.score.score,
        } : payload = {
          "engagement_category" : element?.score?.engagement_category,
          'target' : element?.score.target,
        }


        sendEngagementPillarValue(payload)
      }
    }
  };
  
  const sendEngagementPillarValue = async (data) => {

     // == ======== engagement score update == =====
   
      if (data != undefined) {
       let result = await sendEngagementCategoryRequestAction("emp/score", [data]);
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
  };

const [getToolTipIndex,setToolTipIndex] = useState(null);
 return (
    <>
      <Box className="engagement_pillars-wrapper">
        <ClickAwayListener
          onClickAway={() => {
            setOpen("");
          }}
        >
          {engagementCategories.length > 0 ? (
            <Box className="engagementPillar-sliderWrapper">
              {_.sortBy(engagementCategories, "sort")?.map((item, index) => 
                  <PillarCard
                    data={item}
                    triggerScoreChangeEvent={(element,type)=>{handleCallBackEvent(element,type)}}
                    triggerComment={(element)=>{
                      handleCallBackEvent(element,'comment')
                    }}
                    key={index}
                    index={index}
                    tooltipEvent={(element)=>{setToolTipIndex(element)}}
                    activeTooltip={getToolTipIndex}
                  /> 
                  )
                }
              </Box>)
            :
              <Box className="engagementPillar-sliderWrapper">
                {[1,2,3,4,5,6,7,8,9].map((item,index)=>{return (<div key={index}><PillarCard /></div>)})}
              </Box>
              }
        </ClickAwayListener>
      </Box>
    </>
  );
};

export default EngagementPillars;