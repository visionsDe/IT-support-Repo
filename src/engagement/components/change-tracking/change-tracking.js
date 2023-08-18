import React, { useEffect, useRef, useState } from "react";
import "./change-tracking.scss";
import { Card, CardHeader, CardContent, Typography, Box, Avatar, Stack, Button, List, ListItem, ListItemText, ListItemAvatar, Chip, LinearProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useSelector } from "react-redux"
import * as _ from "lodash";
const ChangeTracking = ({ loading, hasNextPage, error, loadMore }) => {
  const { changeTracking } = useSelector(state => state.changeTracking);
  const { engagementCategoryList } = useSelector((state) => state.engagementCategory);

  const [getChangeTracking, setChangeTracking] = useState([]);
  useEffect(() => {
    setChangeTracking(changeTracking);
  }, [changeTracking])
  const employee_data = [
    {
      id: 1,
      pillarName: "Sense of Purpose",
      lastScore: 4,
      currentScore: 9,
    },
    {
      id: 1,
      pillarName: "Feedback",
      lastScore: 4,
      currentScore: 2,
    },
    {
      id: 1,
      pillarName: "Opportunity",
      lastScore: 4,
      currentScore: 8,
    },
    {
      id: 1,
      pillarName: "Recognition",
      lastScore: 4,
      currentScore: 8,
    },
    {
      id: 1,
      pillarName: "Rewards",
      lastScore: 6,
      currentScore: 5,
    },
    {
      id: 1,
      pillarName: "Collaboration",
      lastScore: 5,
      currentScore: 5,
    },
    {
      id: 1,
      pillarName: "Innovation",
      lastScore: 4,
      currentScore: 3,
    },
    {
      id: 1,
      pillarName: "Manager Guidance",
      lastScore: 8,
      currentScore: 7,
    },
    {
      id: 1,
      pillarName: "Work life Balance",
      lastScore: 4,
      currentScore: 6,
    },
  ];
  const trackingRef = useRef();
  const [trackingLoadRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: '0px 0px 400px 0px',
  });
  return (
    <>
      <Card className="change_tracking-wrapper">
        <CardHeader title="Change Tracking" />
        <CardContent className={(!!loading & getChangeTracking.length == 0) ? " notEnoughDataWrap " : null}>
          <List ref={trackingRef} >
            {getChangeTracking?.map((data, i) => (
              <ListItem key={i}>
                <Stack
                  className={
                    data.score < data.previous_score
                      ? "change_tracking-details low-score"
                      : "change_tracking-details"
                  }
                >
                  <Box component="span" className="details-left">
                    {data.score < data.previous_score && (
                      <>
                        <FontAwesomeIcon icon={faExclamation} />
                      </>
                    )}
                    <Typography variant="h6">{engagementCategoryList?.find(item => item.code == data.code)?.name} </Typography>
                    {(data.type == 'target' && data.previous_score != null) &&
                      <Typography className={'notification_comment'}>(Target)</Typography>
                    }
                    {
                      data.previous_score == null &&
                      <Typography className={'notification_comment'}>{`(${'New'}${data.type == 'target' ? ' - Target' : ''}${data.type == 'engagement' ? ' - Current' : ''})`}</Typography>
                    }
                  </Box>
                  <Box component="span" className="details-right">
                    {data.previous_score != null && <Typography>{data.previous_score} to</Typography>}
                    <Chip
                      label={data.score}
                      color="primary"
                      className={
                        data.previous_score != null ? data.score < data.previous_score ? "red" : "green" : "black"
                      }
                    />
                  </Box>
                </Stack>
              </ListItem>

            ))}

            {!loading & hasNextPage ? (

              <ListItem
                ref={trackingLoadRef}
              >
                <Stack
                  className="change_tracking-details load_more"
                >
                  <Box component="span" className="details-left">
                    <LinearProgress />
                  </Box>
                </Stack>
              </ListItem>
            ) : null}
          </List>
          {(!!loading & getChangeTracking.length == 0) ? <div className="notEnoughData new2">No Notifications</div> : null}
        </CardContent>
      </Card>
    </>
  );
};

ChangeTracking.propTypes = {};

ChangeTracking.defaultProps = {};

export default ChangeTracking;
