import * as React from "react";
import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ListSubheader from '@mui/material/ListSubheader';






function Copyright() {
  return (
    <Typography variant="subtitle2" color="text.secondary">
      {"Copyright © "}
      <Link color="inherit" href="https://www.rnsit.ac.in/cse/">
        RNSIT,
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const HowToUse = () => {

  return (
    <>
      <Box >
        {/* Navbar*/}
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <AppBar position="static" elevation={0}>
            <Toolbar sx={{ background: "#021B38", height: "10vh" }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  margin: "1rem",
                  flexGrow: 1,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                How To Use?
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        {/* Body of Home Page */}
        <Paper
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: "90vh",
            backgroundColor: "whitesmoke",
          }}
        >
        <Paper
          
          sx={{
            p: 2,
            width: "95%",
            marginX: "auto",
            marginY: "1rem",
            display: "flex",
            flexDirection: "column",
            minHeight: "70vh",
            backgroundColor: "#87CEEB",
          }}
        >
            <List sx={{paddingX: "3rem"}}>
            <ListItem disablePadding>
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="REGISTRATION" sx={{fontWeight: "bolder"}} />
            </ListItem>
            <ListItem >
              <Typography variant="body1" color="black">
                Navigate to Vendor Sign In and Click on 'Don't have an account? Sign Up!' 
              </Typography>
            </ListItem>

            <ListItem disablePadding>
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="LOGIN" sx={{fontWeight: "bolder"}} />
            </ListItem>
            <ListItem >
              <Typography variant="body1" color="black">
                Navigate to Vendor Sign In and Click on 'Sign In' 
              </Typography>
            </ListItem>


            <ListItem disablePadding>
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="FORGOT PASSWORD" sx={{fontWeight: "bolder"}} />
            </ListItem>
            <ListItem >
              <Typography variant="body1" color="black">
                Navigate to Vendor Sign In and Click on 'Forgot Password?' 
              </Typography>
            </ListItem>


            <ListItem disablePadding>
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="UPLOAD TENDER" sx={{fontWeight: "bolder"}} />
            </ListItem>
            <ListItem >
              <Typography variant="body1" color="black">
                After logging in you'll be redirected to vendor landing page. <br/> 
                Here you can see the list of ongoing Tenders.<br/>
                Choose a Tender and click "Apply Now". Agree to the T&Cs.<br/>
                Now, you'll be redirected to tender upload page for the Tender that you've selected.<br/>
                Upload .pdf files for EMD, Aadhar, PAN documents.<br/>
                Set the Tender Amount.<br/>
                Click Submit.<br/>
                After successful submit you'll be redirected to previous page.<br/>
              </Typography>
            </ListItem>

            <ListItem disablePadding>
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="EDIT UPLOADED TENDER" sx={{fontWeight: "bolder"}} />
            </ListItem>
            <ListItem >
              <Typography variant="body1" color="black">
                After uploading a Tender, you can edit the EMD, Aadhar or PAN files.<br/>
                You can also edit the Tender amount and set a new amount.
                After editing, click Submit.<br/>
                After successful submit you'll be redirected to previous page.<br/>
              </Typography>
            </ListItem>

            <ListItem disablePadding>
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText disableTypography primary="WITHDRAWING TENDER" sx={{fontWeight: "bolder"}} />
            </ListItem>
            <ListItem >
              <Typography variant="body1" color="black">
                After uploading a Tender, you can also Withdraw your tender.<br/>
                Click on Withdraw button.<br/>
                After successful submit you'll be redirected to previous page.<br/>
              </Typography>
            </ListItem>

            </List>
        </Paper>
        </Paper>
      </Box>
    </>
  );
};

export default HowToUse;
