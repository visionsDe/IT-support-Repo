import React, { useEffect, useRef, useState } from "react";
import "./charts.scss";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import moment from 'moment';
import { Box, Button, Stack, Card, CardContent } from '@mui/material';
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <>
        <div className="custom-tooltip">
          <span className="label">{Math.round(payload[0].payload.pulse)}</span>
          <span className="date">{moment(payload[0].payload.pulse_time).format('MM/DD/y')}</span>
        </div>
      </>
    );
  }

  return null;
};
const Charts = ({handleTrendEvent}) => {
  const [getTrendType,setTrendType] = useState('weeks');
  const [getTrendGraphData, setTrendGraphData] = useState([]);
  const { employeeTrendGraph } = useSelector(state => state.trendGraphs);
  const updateTrendGraph = () =>{
    if(employeeTrendGraph?.length > 0){
      let record = employeeTrendGraph?.filter(item=>item.pulse != null)
      setTrendGraphData(record);
    }
  }
  const months = ['jan','feb','mar','apr','may','june','july','aug','sep','oct','nov','dec'];
  useEffect(()=>{
    updateTrendGraph();
  },[employeeTrendGraph])
  const handleFilterEvent = (element) => {
    handleTrendEvent(element.currentTarget.dataset.value)
    setTrendType(element.currentTarget.dataset.value)
  };
  function CustomizedTick(props) {
    const { x, y, payload } = props;
    const currentItem = getTrendGraphData.find(item=>item.pulse_time == payload.value);
    if(currentItem != undefined){
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={8}>
            <tspan textAnchor="middle" x="0" fontSize="12px" fill="#6C6C6C" style={{textTransform:"capitalize"}}>
            {getTrendType == 'weeks' ? (currentItem.week != undefined ? 'Week '+currentItem?.week : 'loading...' ) : ''}
            {getTrendType == 'months' ? (currentItem.month != undefined ? months[currentItem?.month-1]: 'loading...') : ''}
            {getTrendType == 'years' ? (getTrendGraphData.length > 0 ? getTrendGraphData[0]?.year : moment().year()):''}
            </tspan>
            {
              getTrendType == 'weeks' ?
              <tspan sx={{ marginTop: "5px" }} textAnchor="middle" x="0" dy={14} fontSize="11px" fill="#0000004d">
                {moment(payload.value).format('MM/DD/y')}
              </tspan>
              :
            ''
            }
            
          </text>
        </g>
      );
    }else{
      return (<g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={8}>
        <tspan textAnchor="middle" x="0" fontSize="12px" fill="#6C6C6C" style={{textTransform:"capitalize"}}>
        </tspan></text></g>)
    }
  }
  const renderButtonChart = (element) =>{
    let result;
    return(
      element?.map((item,index) => getTrendType == item.name ? 
    <Button  variant="contained" key={index} onClick={handleFilterEvent} data-value={item.name}>{item.label}</Button> : 
    <Button  variant="contained" key={index} color="neutral" onClick={handleFilterEvent} data-value={item.name}>{item.label}</Button>))
  }
  const graphWrapper = useRef();
  return (
    <>
      <Card className="pulse_chart-wrapper">
        <CardContent ref={graphWrapper}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              p: "12px 24px",
            }}
          >
            <Stack direction="row" spacing={1}>
              <Typography sx={{ fontSize: "17px", fontWeight: "bold",margin: "5px 0px" }}>
                Pulse Trend
                <Typography component="span" sx={{ marginLeft:"4px", fontSize: "12px", fontWeight: "500",color: "#707070" }}>
                {
                  getTrendType != 'years' &&
                  'Year: ' + (getTrendGraphData.length > 0 ? moment(getTrendGraphData[0]?.pulse_time).format('YYYY') :  moment().year()) 
                 }
                 </Typography>
              </Typography>
            </Stack>
            <Stack direction="row" className="graphButtonRow" spacing={1}>
              {renderButtonChart([
                {name:'weeks',label:'Week'},
                {name:'months',label:'Month'},
                {name:'years',label:'Year'},
                ])}
            </Stack>
          </Box>
          {!!getTrendGraphData.length && getTrendGraphData.length > 1 ? (
            <>
              <Box>
                {/* {getTrendGraphData.length} */}
                <ResponsiveContainer width="100%" height="100%" className="chartContainer">
                  <AreaChart
                    data={getTrendGraphData}
                    margin={{ top: 10, right: 40, left: -25, bottom: 10 }}                    
                  >
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#F49323"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F49323"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      xAxisId="0"
                      
                      tick={<CustomizedTick  />}
                      
                      dataKey='pulse_time'
                   
                      label={{ fill: "#6c6c6c" }}
                      tickLine={{ stroke: "#f00" }}
                      style={{
                        fontSize: "12px",
                      }}
                      interval={Math.floor(getTrendGraphData.length/Math.floor(graphWrapper.current.clientWidth/60))}
                     
                    />


                
                    <YAxis
                    
                      tickLine={{ stroke: "#0000" }}
                    />
                    <CartesianGrid strokeSolidarray="3 3" stroke="#70707030" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="pulse"
                      stroke="#F49323"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </>
          ) 
          : (
            <>
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  height: "calc(100% - 60px)",
                  backgroundColor: "#F5F5F5",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <Typography sx={{ fontSize: "22px", color: "#898989" }}>
                  Not Enough Data
                </Typography>
              </Box>
            </>
          )
          }
        </CardContent>
      </Card>
    </>
  );
};
export default Charts;
