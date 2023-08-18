import React from 'react';
import './pillar-indicators.scss';
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircleIcon from "@mui/icons-material/Circle";

const PillarIndicators = () => {
  return (
    <>
      <Card
        sx={{
          maxWidth: "230px",
          boxShadow:"none",
          borderRadius: "10px",
          border: "1px solid #22A6DE",
          textAlign: "center",
          "@media (max-width: 575px)": {
            maxWidth: "100%",
          },
        }}
        className="engagement_pillars-targetBox"
      >
        <List sx={{ p: "20px" }}>
          <ListItem sx={{ p: "0" }}>
            <ListItemIcon sx={{ minWidth: "auto", marginRight: "12px" }}>
              <CircleIcon sx={{ color: "#FC941B", fontSize: "2rem" }} />
            </ListItemIcon>
            <ListItemText primary="Target" />
          </ListItem>
          <ListItem sx={{ p: "0", mt: "15px" }}>
            <ListItemIcon sx={{ minWidth: "auto", marginRight: "12px" }}>
              <CircleIcon sx={{ color: "#22A6DE", fontSize: "2rem" }} />
            </ListItemIcon>
            <ListItemText primary="Current" />
          </ListItem>
        </List>
      </Card>
    </>
  );
};

PillarIndicators.propTypes = {};

PillarIndicators.defaultProps = {};

export default PillarIndicators;
