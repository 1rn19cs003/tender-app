import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import VendorCardComponent from "./VendorCardComponent";
import Paper from "@mui/material/Paper";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Button from "@mui/material/Button";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { ToWords } from 'to-words';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";



// Used for snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const VendorTenderDetails = () => {
  const navigate = useNavigate();

  //  To Words package config
  const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: { 
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    }
  }
});
  //---------------------------

  const [selectedFile1, setSelectedFile1] = React.useState(null);
  const [selectedFile2, setSelectedFile2] = React.useState(null);
  const [selectedFile3, setSelectedFile3] = React.useState(null);

  const [urlFile1, setURLFile1] = React.useState(null);
  const [urlFile2, setURLFile2] = React.useState(null);
  const [urlFile3, setURLFile3] = React.useState(null);


  const [email, setEmail] = React.useState(
    window.sessionStorage.getItem("userEmail")
  );
  const [val, setVal] = React.useState({
    tender_name: window.sessionStorage.getItem("tender_name"),
    // start_date: "09/20/2022",
    end_date: window.sessionStorage.getItem("end_date"),
    tender_val: "",
    tender_val_words: "",
  });

  const handleValueChange = (e) => {
    // --------handleChange----------
    const { name, value } = e.target;
    setVal((prevState) => ({
      ...prevState,
      [name]: value,
      ["tender_val_words"]: toWords.convert(Number(value), { currency: true, ignoreZeroCurrency: true }),
    }));
    // -----------------------------------
    
  }

  const [existingTender, setExistingTender] = React.useState("");
  React.useEffect(() => { 
  // 1. Check if Vendor has an existing tender
  axios({
    url: "https://tranquil-temple-34464.herokuapp.com/all_data",
    method: "GET",
    withCredentials: true,
    crossDomain: true,
  }).then((res) => {
    for (var i = 0; i < res.data.length; i++) {
      if (
        res.data[i].tenderName == window.sessionStorage.getItem("tender_name") &&
        res.data[i].profile.email == email
      ) {
        // existing tender - TRUE.  Store tenderVal in existing tender
        console.log("existing tender - TRUE" + existingTender)
        setExistingTender(res.data[i].profile.tenderValue);
        console.log("After setExistingTender " + existingTender)
        break;
      }
    }
  });
  }, []);



  const hasApplied = () =>
  {
    if (existingTender !== "") {
      return (
        <>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Alert
            severity="error"
            sx={{ padding: "1rem", justifyContent: "center" }}
          >
            <strong>
              You have already submitted. &nbsp;If you re-submit, your
              existing Tender Amount will be updated.
            </strong>
          </Alert>
        </Grid>
        </>
      );
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();


    const formData = new FormData();                //      (event.currentTarget)
    formData.append("emd", selectedFile1);
    formData.append("aadhar", selectedFile2);
    formData.append("pan", selectedFile3);
    
    const newTender = {
      // File Upload
      tenderName: val.tender_name,
      tenderValue: val.tender_val,
      email: email,
      endDate: val.end_date,

      amountWords: val.tender_val_words,

      edm: formData.get("emd"),        // ******This is Uploading EMD File******
      
      // *****Upload PAN File*****
      pan: formData.get("pan"), 

      // *****Upload AADHAR File********
      aadhar: formData.get("aadhar")

    };
    // console.log("newTender :", newTender);
    if (newTender.tenderValue === "") {
      window.alert("Tender value cannot be empty!");
      return;
    }

    // --------------- existingTender : TRUE -----------------------
    // --------------- UPDATE TenderValue ONLY ---------------------
    if (existingTender !== "")
    {
      console.log("Update Tender Value : ", newTender.tenderName, newTender.email, newTender.tenderValue);

      // AXIOS Connection TODO


      setOpen2(true)
      return;
    }


    

    if (newTender.edm === "null" || newTender.pan === "null" || newTender.aadhar === "null" ) {
      window.alert("EMD, PAN and AADHAR file upload is mandatory!");
      return;
    }
    else if (newTender.edm.type != "application/pdf" || newTender.pan.type != "application/pdf" || newTender.aadhar.type != "application/pdf") {
      window.alert("Only PDF files are allowed!");
      return;
    }
    else {

      //  Throw <Alert> | Delete Existing Tender | ReSubmit tender
      // if (existingTender !== "") {
      //   if (window.confirm("Are you sure? Your existing tender application of Rs. " + existingTender + " will be deleted.")) {
      //     // Clicks Agree

      //     console.log(
      //       "Deleting existing tender. ",
      //       newTender.tenderName,
      //       newTender.email
      //     );
      //     // Delete existing tender using newTender.tenderName and newTender.email
      //     axios
      //       .delete(
      //         "https://tranquil-temple-34464.herokuapp.com/delete_tender",
      //         {
      //           data: {
      //             tenderName: newTender.tenderName,
      //             email: newTender.email,
      //           },
      //         }
      //       )
      //       .then((res) => {
      //         console.log("Deleted existing tender.");

      //         // AXIOS Connection -  Upload New Tender
      //         try {
      //           const response = axios({
      //             method: "post",
      //             url: "https://tranquil-temple-34464.herokuapp.com/upload_file",
      //             data: newTender,
      //             headers: { "Content-Type": "multipart/form-data" },
      //           });
      //           console.log("Success! Tender Uploaded.");
      //           setOpen(true);
      //           navigate("/vendor/uploadtender");
      //           return;
      //         } catch (error) {
      //           console.log("Error. Tender not Uploaded!\n", error);
      //           window.location.reload();
      //           return;
      //         }
      //       });
      //   }
      //   else {
      //     // Clicks "Disagree" or "Click Away"
      //     console.log("Disagree/Clickaway")
      //     return;
      //   }

      // }

      // ----------------------------- FIRST Tender---------------------------------
      if (existingTender === "")
      {
        console.log("First tender - True ", existingTender);
        // AXIOS Connection -  Upload New Tender
        try {
          const response = await axios({
            method: "post",
            url: "https://tranquil-temple-34464.herokuapp.com/upload_file",
            data: newTender,
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Success! Tender Uploaded.", newTender);
          setOpen(true);
          navigate("/vendor/uploadtender");
        } catch (error) {
          console.log("Error. Tender not Uploaded!\n", error);
          // window.location.reload();
        }
      }
    }
  };

    
  const handleFileSelect1 = (event) => {
    setSelectedFile1(event.target.files[0]);
    setURLFile1(URL.createObjectURL(event.target.files[0]));
  };
  const handleFileSelect2 = (event) => {
    setSelectedFile2(event.target.files[0]);
    setURLFile2(URL.createObjectURL(event.target.files[0]));
  };
  const handleFileSelect3 = (event) => {
    setSelectedFile3(event.target.files[0]);
    setURLFile3(URL.createObjectURL(event.target.files[0]));
  };
    


  
  // -----Opening and Closing snackbar-----
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpen2(false);
  };
  // -----------------------------

  const logout = () => {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      //   console.log(res);
    });
    navigate("/");
  };

  return (
    <>
      <Box>
        {/* Navbar */}
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
                Upload Tender 
              </Typography>
              <IconButton
                edge="start"
                color="warning"
                aria-label="Logout"
                onClick={logout}
              >
                <Typography variant="caption" color="">Logout&nbsp;</Typography> <LoginIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
                
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {hasApplied()}
          <Grid item xs={12}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                minHeight: "80vh", // Change this
                backgroundColor: "#D4F1F4",
              }}
            >
              <Typography variant="h4" color="text.primary" align="center">
                Tender Details
              </Typography>
              <br />
              <br />
              <Grid
                sx={{ paddingX: "1rem" }}
                container
                rowSpacing={2}
                // columnSpacing={{ xs: 1, sm: 2, md: 10 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Tender Name
                  </Typography>
                </Grid>
                <br />
                <br />
                {/* ----------------------------------------------- */}

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    value={val.tender_name}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Application Form
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <a
                    href={
                      window.sessionStorage.getItem("file_name")
                    }
                    target="_blank"
                    download={window.sessionStorage.getItem("file_name") + ".pdf"}
                    style={{ textDecoration: "none" }}
                  >
                  <Button
                    fullWidth
                    startIcon={<DownloadRoundedIcon />}
                    variant="contained"
                  >
                    Download
                  </Button>
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                {/* <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Start Date
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    value={val.start_date}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </Grid> */}
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    End Date
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    value={val.end_date}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    EMD File 
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    disabled={existingTender}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload (.pdf)
                    <input type="file" onChange={handleFileSelect1} hidden />
                  </Button>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                </Grid>
                <Grid item xs={8}>
                  <a href={urlFile1} target="_blank">
                  {urlFile1 && "View File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}


                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Aadhar 
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    disabled={existingTender}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload (.pdf)
                    <input type="file" onChange={handleFileSelect2} hidden />
                  </Button>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                </Grid>
                <Grid item xs={8}>
                <a href={urlFile2} target="_blank">
                  {urlFile2 && "View File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4} >
                  <Typography variant="overline" color="text.primary">
                    PAN 
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    disabled={existingTender}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload (.pdf)
                    <input type="file" onChange={handleFileSelect3} hidden />
                  </Button>
                </Grid>
                {/* ----------------------------------------------- */}


                <Grid item xs={4}>
                </Grid>
                <Grid item xs={8}>
                <a href={urlFile3} target="_blank">
                  {urlFile3 && "View File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Tender Amount
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    type="number"
                    fullWidth
                    name="tender_val"
                    value={val.tender_val}
                    onChange={handleValueChange}
                    variant="outlined"
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Amount (in words)
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="tender_val_words"
                    value={val.tender_val_words}
                    multiline="true"
                    // onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                

               

                <Grid item xl={2}>
                  <Button
                    type="submit"
                    // startIcon={<CheckBoxRoundedIcon />}
                    variant="contained"
                    color="success"
                    sx={{
                      height: "7vh",
                      width: "10vw",
                      marginX: "auto",
                      marginY: "1rem",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Container>
      </Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Tender Uploaded.
        </Alert>
      </Snackbar>
      <Snackbar open={open2} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Amount Updated Successfully.
        </Alert>
      </Snackbar>
    </>
  );
};

export default VendorTenderDetails;
