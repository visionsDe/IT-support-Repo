import React, { useEffect, useState } from "react";
import "./pulseRating.scss";
import {Card ,CardHeader,CardContent,CardActions,Typography ,Button ,Box ,Radio ,RadioGroup ,FormControlLabel} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { PulseComments } from "./pulse-modal";
import { getPulseCommentAction, getPulseValueAction, setPulseValueAction } from "../../actions/engagement";
import { setPulseCommentList, setPulseValueList } from "../../reducer/engagementPillars";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "lodash";
import moment from 'moment';
import momenttz from "moment-timezone";
import { useSnackbar } from "notistack";

const PulseRating = () => {
  const dispatch = useDispatch();
  const [pulseRatingValue, setPulseRatingValue] = useState("");
  const [saveResponse, setSaveResponse] = useState("");
  const[showMessage , setShowMessage] = useState(true);
  const [getDisablePulse, setDisablePulse] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [getNextWeek,setNextWeek] = useState(null);
  const [getMonday,setMonday] = useState('loading...');
  const [responseHeaderMessage, setResponseHeaderMessage] = useState(
    "Choose a number to select your response"
  );
  const { pulseValueList ,pulseCommentList } = useSelector((state) => state.engagementCategory);
  const sliderCallback = React.useRef(null);
  const currentDate = new Date();
  const n = 10;
  const handleSaveResponse = async() => {
    let d = customDateFormat(new Date())
    if (saveResponse == "") {
     try{ setSaveResponse(d);
      await setPulseValueAction('emp/pulse/'+pulseRatingValue);
      setResponseHeaderMessage(
        `Your response was submitted on ${customDateFormat(new Date())}`
      );
      setDisablePulse(true);
      pulseRatingListDispatch();
      let variant = 'success';
      enqueueSnackbar('Pulse Submitted', {variant});}
      catch(err){
        console.error(err.message())
      }
      
    }
  };
  const customDateFormat = (element) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(element);
  };

  const handleFunction = () => {
   if (saveResponse != "" && pulseRatingValue != "0") {
      setShowMessage(true)
      setResponseHeaderMessage(
        `Your response was already submitted on 
       ${saveResponse}
        `
      );
    }
  };

  const pulseActive = (element) =>{
    if(!getDisablePulse){
      setPulseRatingValue(element.target.value);
    }
  };
  const pulseRatingListDispatch = async () => {
    let value = await getPulseValueAction('emp/pulse');
    if(value){
      dispatch(setPulseValueList(value));
    }
  }
  
  useEffect(() => {
    pulseRatingListDispatch();
    return()=>{
      dispatch(setPulseCommentList({}))
    }
  },[])

  const getLatestDateValues = async (element) => {
    if(element != '' ){
        let result = element;
        const date1 = getETNow();
        const date2 = new Date(result?.update_time);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return {result , diffDays};
      }else{
        return {};
      }
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
  const executePulseValueCheck = async () => {
    if(!!pulseValueList){
   
      let values = await getLatestDateValues(pulseValueList);
      if(Object.keys(values)?.length > 0){
      
     
      let submissionDate = await getETNow(values?.result?.update_time);

      
      if(values.result != undefined && values.result.update_time != ''){
        setSaveResponse(moment(values?.result?.update_time).format("MM/DD/YYYY"))
        setPulseRatingValue(values?.result?.pulse.toString());
        setShowMessage(false)
      }else if(values.result.pulse == null && values.result.update_time == ''){
        setDisablePulse(false);
      }

        let currentDateTime = getETNow();
        let submissionCheckDate;
        if(currentDateTime.getDay() == 1 && currentDateTime.getHours() < 8){
          let lastWeek = new Date(currentDateTime.getTime() - 7 * 24 * 60 * 60 * 1000);
          lastWeek.setHours(8, 0, 0, 0);
          submissionCheckDate = lastWeek;
        }
        else if(currentDateTime.getDay() == 0){
          let lastWeek = new Date(currentDateTime.getTime() - 6 * 24 * 60 * 60 * 1000);
          lastWeek.setHours(8, 0, 0, 0);
          submissionCheckDate = lastWeek;
        }
      
        else{
          var objToday = getETNow();
          let first = objToday.getDate() - objToday.getDay() + 1;
          let currentWeekStartDate = new Date(objToday.setDate(first));
          currentWeekStartDate.setHours(8,0,0,0)
          submissionCheckDate = currentWeekStartDate;
        }
        setNextWeek(submissionCheckDate)
        if(submissionCheckDate.getTime() > submissionDate.getTime()){
            setDisablePulse(false);
            setSaveResponse('')
            setPulseRatingValue('');
        }
      }
    }
  }
  useEffect(() => {
    executePulseValueCheck()
  },[pulseValueList])
useEffect(()=>{
  setMonday(()=>{
    if(getNextWeek != null){
      let d =  getNextWeek;
      d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || 7));
      let result = moment(d).format("MM/DD/YYYY");
      return result;
    }else{
      return 'loading...'
    }
  })
},[getNextWeek])
return (
    <Card className="pulse_rating-wrapper">
      <CardHeader title="How are you feeling about your work this week?" />
      <CardContent className="xxxxxxxxx">
        {(!!saveResponse && !showMessage && pulseRatingValue != "0")?
        <Typography>Your response was submitted on {saveResponse}</Typography>
        :
        <Typography>{responseHeaderMessage}</Typography>}
        <Box mx="auto" onClick={handleFunction} >
          <RadioGroup row>
            {[...Array(n)].map((elementInArray, index) => (
              <FormControlLabel
                key={index}
                value={index + 1}
                disabled={getDisablePulse ? true : false}
                control={
                  <Radio
                  value={index + 1}
                  checked={pulseRatingValue==index + 1? true: false}
                  color="white"
                  disableRipple
                  checkedIcon={<CircleIcon />}
                  icon={<CircleIcon />}
                  onClick={pulseActive}
                  />
                }
                label={index + 1}
              />
            ))}
          </RadioGroup>
        </Box>
      </CardContent>
      <CardActions>
          {saveResponse != "" ? (
            <div className="checkIn-message">
              <Typography>Next Pulse Check-In</Typography>
              <Typography>Available {getMonday}</Typography>
            </div>
          ) : (
            ""
          )}
          <Button 
            type="submit"
            size="100%"
            variant="outlined"
            color="white"
            disabled={(saveResponse != "" || pulseRatingValue == '') ? true : false }
            className="btn-white"
            sx={{
              padding: "10px 35px",
            }}
            onClick={
              handleSaveResponse
            }
          > 
            Save Response
          </Button>
          <div className="add-comment-btn">
            <PulseComments saveResponse={saveResponse} pulseRatingValue={pulseRatingValue} pulseCommentList={pulseCommentList}/>
          </div>
        </CardActions>
    </Card>
  );
};

PulseRating.propTypes = {};

PulseRating.defaultProps = {};

export default PulseRating;
