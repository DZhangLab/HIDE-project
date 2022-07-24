import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Grid, Button, Box } from "@material-ui/core";
import useStyles from "./styles.js";
import Verifier from "./verifier/Verifier.js";

import VerifierRegistry from "../../artifacts/contracts/Registries/VerifierRegistry.sol/VerifierRegistry.json";

const verifierRegistryAddress = process.env.REACT_APP_VERIFIER_ADDRESS;

const Verifiers = () => {
  const [verifierArray, setverifierArray] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    console.log("getting verifiers");
    getVerifiers();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getVerifiers() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        verifierRegistryAddress,
        VerifierRegistry.abi,
        provider
      );
      try {
        setverifierArray(await contract.getAll());
        console.log(verifierArray);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <div>
      Verifiers
      <br />
      <Button onClick={getVerifiers}>Get Verifiers</Button>
      <Box m={2}>
        <Grid
          className={classes.container}
          container
          allignment="stretch"
          spacing={1}
          padding={2}
        >
          {verifierArray.map((verifier) => (
            <Grid item sm={4}>
              <Verifier verifier={verifier} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Verifiers;
