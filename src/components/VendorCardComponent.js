import * as React from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";



// Used for snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VendorCardComponent = ({ data }) => {

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleClickAway = () => {     // // "DISAGREE" button is clicked    OR    User has clicked away 
    setOpenDialog(false);
  };
  const handleDialogClose = () => {   // "AGREE" button is clicked
    setOpenDialog(false);
    navigate("./tender");
  };
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [check, setCheck] = React.useState(0);
  const [email, setEmail] = React.useState(null);
  try {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/status",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      console.log(res);
      if (res.data.isLogged === false) {
        setCheck(0);
        setEmail( window.sessionStorage.getItem("userEmail") );
        console.log("Not Logged In", email);
      } else {
        setCheck(1);
        setEmail( window.sessionStorage.getItem("userEmail") );
        console.log("Logged In", email);
        // console.log(res.data.profile.email);
      }
    });
  } catch (err) {}

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (check === 1 || check === 0) {
      let tendername = event.target.querySelector("h5").innerText; // User selected
      let tendervalue = event.target.tenderValue.value; // User selected

      // Retrieve endDate from "data" for the User selected tender name
      let enddate;
      for (let i = 0; i < data.length; i++)
        if (data[i].tenderName.trim() === tendername.trim())
          enddate = data[i].endDate;
      console.log(enddate);
      //  -------- Now "enddate" has the endDate for the User Selected tender

      const formData = new FormData(event.currentTarget);
      formData.append("file", selectedFile);
      const newTender = {
        // File Upload
        tenderName: tendername,
        tenderValue: tendervalue,
        email: email,
        endDate: enddate,
        tender_file: formData.get("file"),
      };
      console.log(newTender);
      
    
      if (newTender.tender_file === "null") {
        window.alert("File Upload is mandatory!");
        return;
      } else if (newTender.tenderValue === '') {
        window.alert("Tender value cannot be empty!");
        return;
      } else {
        // AXIOS Connection - TODO
        try {
          const response = await axios({
            method: "post",
            url: "https://tranquil-temple-34464.herokuapp.com/upload_tender_file",
            data: newTender,
            headers: { "Content-Type": "multipart/form-data" },
          });
          setOpen(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // Download Admin Tender File
  const downloadFile = async (name) => {
    console.log("Download File : ", name);
  };

  // Upload Vendor Tender File
  const uploadFile = async (name) => {
    console.log("Upload File : ", name);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  // route change to VendorTenderDetails
  const routeChange = (x) => { 
    window.sessionStorage.setItem("tender_name", x);

    // Retrieve endDate from "data" for the User selected tender name
    let enddate;
    for (let i = 0; i < data.length; i++)
      if (data[i].tenderName.trim() === x.trim())
      {
        window.sessionStorage.setItem("end_date", data[i].endDate);
        window.sessionStorage.setItem("file_name", data[i].filename);
      }
    //  -------- Now "enddate" has the endDate for the User Selected tender
    setOpenDialog(true); 
    // navigate("./tender");
  }


  // -----Opening and Closing snackbar-----
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  // -----------------------------

  return (
    <>
      {data.map((data, index) => {
        return (
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 150,
                backgroundColor: "#D4F1F4",
              }}
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={11}>
                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ ml: 3, mt: 1, fontWeight: "bold" }}
                  >
                    {data.tenderName}
                  </Typography>
                  <br></br>
                  <br></br>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-evenly"
                  >
                    <Button
                      component="label"
                      startIcon={<ForwardRoundedIcon />}
                      variant="contained"
                      sx={{ width: "15vw", height: "8vh" }}
                      onClick={() => {
                        routeChange(data.tenderName);
                      }}
                      // onClick={handleDialogOpen}
                    >
                      Apply Now
                    </Button>
                  </Stack>
                  <br></br>
                </Grid>
              </Grid>
            </Paper>



            <Dialog open={openDialog} onClose={handleClickAway} maxWidth="sm">
              <DialogTitle>{"Terms & Conditions"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    paddingX="1rem"
                  >
                    <Grid item xs={12}>
                      <Typography variant="h7" color="secondary">
                        Disclaimer:{" "}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h9" color="text.primary">
                        1. Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Repudiandae, velit sit amet consectetur adipisicing.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h9" color="text.primary">
                        2. Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Optio natus necessitatibus ducimus magnam nesciunt
                        debitis veniam blanditiis suscipit. Omnis, corporis sit amet consectetur adipisicing.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h9" color="text.primary">
                        3. Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Odio architecto fuga voluptates similique deserunt
                        esse, beatae fugiat sunt.
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickAway} color="error">Disagree</Button>
                <Button onClick={handleDialogClose}>Agree</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        );
      })}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Tender Uploaded.
        </Alert>
      </Snackbar>
    </>
  );
};

export default VendorCardComponent;
