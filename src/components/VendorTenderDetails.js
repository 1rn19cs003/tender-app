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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


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

  const [firstClick, setFirstClick] = React.useState(true);
  //---------------------------

  const [selectedFile1, setSelectedFile1] = React.useState(null);
  const [selectedFile2, setSelectedFile2] = React.useState(null);
  const [selectedFile3, setSelectedFile3] = React.useState(null);

  const [urlFile1, setURLFile1] = React.useState(null);
  const [urlFile2, setURLFile2] = React.useState(null);
  const [urlFile3, setURLFile3] = React.useState(null);

  const [existing_val, set_existing_val] = React.useState("0.00");

  const [email, setEmail] = React.useState(
    window.sessionStorage.getItem("userEmail")
  );
  const [val, setVal] = React.useState({
    tender_name: window.sessionStorage.getItem("tender_name"),
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

  const [hrefEMD, sethrefEMD] = React.useState();
  const [hrefAADHAR, sethrefAADHAR] = React.useState();
  const [hrefPAN, sethrefPAN] = React.useState();



  const [isWithdrawn, setIsWithdrawn] = React.useState();
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
        setExistingTender(res.data[i].tenderValue);
        if (existingTender !== "" && !isWithdrawn) {
          set_existing_val(existingTender); 
        }
        // Set download links of EMD, PAN, AADHAR to state variables 
        sethrefEMD( res.data[i].profile.edm.location );
        sethrefAADHAR( res.data[i].profile.aadhar.location );
        sethrefPAN( res.data[i].profile.pan.location );

        // Set isWithdrawn
        setIsWithdrawn( res.data[i].withdraw );

        break;
      }
    }
  });
  }, []);

  const withdrawTender = () => {

    if (firstClick === false)
      return;
    
    setFirstClick(false);

    
    if (window.confirm("Do you really want to withdraw your tender?"))
    {
      console.log("Withdrawing Tender :", val.tender_name, email);
      
      // set Withdrawn field to TRUE 
      axios({
        url: "https://tranquil-temple-34464.herokuapp.com/update_withdraw",
        method: "POST",
        withCredentials: true,
        crossDomain: true,
        data: { tenderName: val.tender_name, email: email, withdraw: "YES." },
      }).then((res) => {
        console.log("Tender withdrawn successfully. ", res);
      })      

        // setOpen2(true);
        // setTimeout(function () { navigate("/vendor/uploadtender"); }, 2000);
        // navigate("/vendor/uploadtender");           // UNDO
    }
    else {
      setFirstClick(true);
    }
    return;
  };



  const hasApplied = () =>
  {
    if (existingTender !== "" && !isWithdrawn ) {
      return (
        <>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Alert
              severity="error"
              sx={{ padding: "1rem", justifyContent: "center" }}
            >
              <strong>
                You have already submitted. &nbsp;If you re-submit, your existing tender details will be updated.
              </strong>
            </Alert>
          </Grid>
        </>
      );
    }
    else if(existingTender !== "" && isWithdrawn) {
      return (
        <>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Alert
              severity="success"
              sx={{ padding: "1rem", justifyContent: "center" }}
            >
              <strong>
                Tender withdrawn. You can submit a new Tender now.
              </strong>
            </Alert>
          </Grid>
        </>
      );
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (firstClick === false)
      return;
    
    setFirstClick(false);

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
      edm: formData.get("emd"),
      pan: formData.get("pan"), 
      aadhar: formData.get("aadhar"),
      withdraw: null                      //      set Withdrawn field
    };
    console.log("New Tender : ", newTender);

    // *****************CASE 1 : First Tender Upload*************************

    if (existingTender === "" && !isWithdrawn)
    {
      if (newTender.tenderValue === "") {
        window.alert("Tender value cannot be empty!");
        setFirstClick(true);
        return;
      }
      else if (newTender.edm === "null" || newTender.pan === "null" || newTender.aadhar === "null" ) {
        window.alert("EMD, PAN and AADHAR file upload is mandatory!");
        setFirstClick(true);
        return;
      }
      else {
        console.log("CASE 1 : First Tender Upload ");
        // AXIOS Connection -  Upload New Tender
        try {
          const response = await axios({
            method: "post",
            url: "https://tranquil-temple-34464.herokuapp.com/upload_file",
            data: newTender,
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Success! Tender Uploaded. Case 1.\n");
          setOpen(true);

          // setTimeout(function () { navigate("/vendor/uploadtender"); }, 2000);        // UNDO
          return;
        } catch (error) {
          console.log("Error. Tender not Uploaded! Case 1.\n", error);
          window.location.reload();
          return;
        }
      }
      return;
    }


    // *****************CASE 2 : Editing after First Upload*************************
    if (existingTender !== "" && !isWithdrawn)
    {
      console.log("CASE 2 : Editing after First Upload");


      // EDM File edited
      if(newTender.edm !== "null")
      {
        console.log("EDM File edited");
        await axios({
          url: "https://tranquil-temple-34464.herokuapp.com/upload_edm",
          method: "POST",
          data: { tenderName: val.tender_name, email: email,  EDM_file: formData.get("emd") },
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          console.log("EDM File updated successfully", res);
        })
      }
      
      // AADHAR File edited
      if(newTender.aadhar !== "null")
      {
        console.log("AADHAR File edited");
        await axios({
          url: "https://tranquil-temple-34464.herokuapp.com/upload_aadhar",
          method: "POST",
          data: { tenderName: val.tender_name, email: email,  aadhar_file: formData.get("aadhar") },
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          console.log("Aadhar File updated successfully", res);
        })
      }

      // PAN File edited
      if(newTender.pan !== "null")
      {
        console.log("PAN File edited");
        await axios({
          url: "https://tranquil-temple-34464.herokuapp.com/upload_pan",
          method: "POST",
          data: { tenderName: val.tender_name, email: email,  PAN_file: formData.get("pan") },
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          console.log("PAN File updated successfully", res);
        })
      }

      // TenderValue edited 
      if(newTender.tenderValue !== "null")
      {
        console.log("tenderValue edited");
        await axios({
          url: "https://tranquil-temple-34464.herokuapp.com/update_vender",
          method: "POST",
          withCredentials: true,
          crossDomain: true,
          data: {
            tenderName: newTender.tenderName,
            email: newTender.email,
            tenderValue: newTender.tenderValue
          },
        }).then((res) => {
          console.log("tenderValue updated successfully ", res);
        })
      }


      setOpen2(true);
      // setTimeout(function () { navigate("/vendor/uploadtender"); }, 2000);          // UNDO
      return;
    }



    // *****************CASE 3 : Second Tender Upload after Withdrawing*************************
    if (existingTender !== "" && isWithdrawn)
    {
      console.log("CASE 3 : Second Tender Upload after Withdrawing");

      if (newTender.tenderValue === "") {
        window.alert("Tender value cannot be empty!");
        setFirstClick(true);
        return;
      }
      else if (newTender.edm === "null" || newTender.pan === "null" || newTender.aadhar === "null" ) {
        window.alert("EMD, PAN and AADHAR file upload is mandatory!");
        setFirstClick(true);
        return;
      }
      else {
        // Delete existing tender
        axios
            .delete(
              "https://tranquil-temple-34464.herokuapp.com/delete_tender",
              {
                data: {
                  tenderName: newTender.tenderName,
                  email: newTender.email,
                },
              }
            )
            .then((res) => {
              console.log("Deleted existing tender");

              // upload new tender & set "withdrawn" to false   
              newTender.withdraw = null;

              // AXIOS connection 
              try {
                const response = axios({
                  method: "post",
                  url: "https://tranquil-temple-34464.herokuapp.com/upload_file",
                  data: newTender,
                  headers: { "Content-Type": "multipart/form-data" },
                });
                console.log("Success! Tender Uploaded. Case 3.\n");
                setOpen(true);
      
                //setTimeout(function () { navigate("/vendor/uploadtender"); }, 2000);    // UNDO
                return;
              } catch (error) {
                console.log("Error. Tender not Uploaded! Case 3.\n", error);             
               // window.location.reload();
                return;
              } 
            })
      }
      
      return;
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
  const [open3, setOpen3] = React.useState(false);


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
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
                <Typography variant="caption" color="">
                  Logout&nbsp;
                </Typography>{" "}
                <LoginIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                    href={window.sessionStorage.getItem("file_name")}
                    target="_blank"
                    download={
                      window.sessionStorage.getItem("file_name") + ".pdf"
                    }
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

                <Grid item xs={3}>
                  <Typography variant="overline" color="text.primary">
                    EMD File
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", maxWidth: "10rem", }}
                    disabled={existingTender && !isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                  >
                    UPLOAD
                    <input type="file" onChange={handleFileSelect1} hidden accept="application/pdf" />
                  </Button>
                </Grid>

                <Grid item xs={3}>
                <a
                        disabled={!existingTender || isWithdrawn}
                        href={hrefEMD}
                        target="_blank"
                        download
                        style={{ textDecoration: "none" }}
                      >
                  <Button
                    sx={{ marginX: "0.5rem", maxWidth: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<DownloadRoundedIcon />}
                    variant="contained"
                  >
                    View EMD
                  </Button>
                  </a>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", maxWidth: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<EditRoundedIcon />}
                    variant="contained"
                  >
                    Edit
                    <input type="file" onChange={handleFileSelect1} hidden accept="application/pdf" />
                  </Button>
                </Grid>

                {/* ----------------------------------------------- */}

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <a href={urlFile1} target="_blank">
                    {urlFile1 && "View Uploaded File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={3}>
                  <Typography variant="overline" color="text.primary">
                    Aadhar
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={existingTender && !isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input type="file" onChange={handleFileSelect2} hidden accept="application/pdf" />
                  </Button>
                </Grid>

                <Grid item xs={3}>
                <a
                        disabled={!existingTender || isWithdrawn}
                        href={hrefAADHAR}
                        target="_blank"
                        download
                        style={{ textDecoration: "none" }}
                      >
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<DownloadRoundedIcon />}
                    variant="contained"
                  >
                    View Aadhar
                  </Button>
                  </a>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<EditRoundedIcon />}
                    variant="contained"
                  >
                    EDIT
                    <input type="file" onChange={handleFileSelect2} hidden accept="application/pdf" />
                  </Button>
                </Grid>

                {/* ----------------------------------------------- */}

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <a href={urlFile2} target="_blank">
                    {urlFile2 && "View Uploaded File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={3}>
                  <Typography variant="overline" color="text.primary">
                    PAN
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={existingTender && !isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input type="file" onChange={handleFileSelect3} hidden accept="application/pdf" />
                  </Button>
                </Grid>

               <Grid item xs={3}>
                <a
                        disabled={!existingTender || isWithdrawn}
                        href={hrefPAN}
                        target="_blank"
                        download
                        style={{ textDecoration: "none" }}
                      >
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<DownloadRoundedIcon />}
                    variant="contained"
                  >
                    View PAN
                  </Button>
                  </a>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<EditRoundedIcon />}
                    variant="contained"
                  >
                    EDIT
                    <input type="file" onChange={handleFileSelect3} hidden accept="application/pdf" />
                  </Button>
                </Grid>

                {/* ----------------------------------------------- */}

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <a href={urlFile3} target="_blank">
                    {urlFile3 && "View Uploaded File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Tender Amount
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="number"
                    label="Existing Tender Amount"
                    sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
                    fullWidth
                    defaultValue={existing_val}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="number"
                    sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
                    fullWidth
                    label="Enter Tender Amount"
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
                {(existingTender && !isWithdrawn) && (
                  <Button
                    fullWidth
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                    variant="contained"
                    sx={{ height: "7vh", width: "10vw", marginX: "auto",}}
                    onClick={() => {
                      withdrawTender();
                    }}
                  >
                    Withdraw
                  </Button>
                )}
                </Grid>
                <Grid item xl={2}>

                </Grid>

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
          Tender Updated.
        </Alert>
      </Snackbar>
      <Snackbar open={open3} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Tender Withdrawn.
        </Alert>
      </Snackbar>
    </>
  );
};

export default VendorTenderDetails;
