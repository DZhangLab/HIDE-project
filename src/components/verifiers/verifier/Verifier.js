import React from "react";
import { useState, useEffect } from "react";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";

import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import useStyles from "./styles.js";

const Verifier = ({ verifier }) => {
  const classes = useStyles();
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography component="span" variant="body2" gutterBottom>
            <VerifiedUserIcon />
            <Box fontWeight="bold" display="inline">
              Verifier Key:{" "}
            </Box>
            {verifier}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verifier;
