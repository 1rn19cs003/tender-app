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

const VendorTenderDetails = () => {
  const navigate = useNavigate();

  const [selectedFile1, setSelectedFile1] = React.useState(null);
  const [selectedFile2, setSelectedFile2] = React.useState(null);
  const [selectedFile3, setSelectedFile3] = React.useState(null);

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();                //      (event.currentTarget)
    formData.append("file", selectedFile1);
    const newTender = {
      // File Upload
      tenderName: val.tender_name,
      tenderValue: val.tender_val,
      email: email,
      endDate: val.end_date,
      tender_file: formData.get("file"),        // ******This is Uploading EMD File******
      
      // *****Upload Aadhar File*****

      // *****Upload PAN File********

    };
    console.log("Send to API :", newTender);
    

    if (newTender.tender_file === "null") {
      window.alert("EMD File Upload is mandatory!");
      return;
    } else if (newTender.tenderValue === "") {
      window.alert("Tender value cannot be empty!");
      return;
    } else {
      // AXIOS Connection 
      try {
        const response = await axios({
          method: "post",
          url: "https://tranquil-temple-34464.herokuapp.com/upload_tender_file",
          data: newTender,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Success! Tender Uploaded.");
      } catch (error) {
        console.log("Error. Tender not Uploaded!\n", error);
      }
    }
    
  };

    
  const handleFileSelect1 = (event) => {
    setSelectedFile1(event.target.files[0]);
  };
  const handleFileSelect2 = (event) => {
    setSelectedFile2(event.target.files[0]);
  };
  const handleFileSelect3 = (event) => {
    setSelectedFile3(event.target.files[0]);
  };
    
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
                <LoginIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
                      "https://tranquil-temple-34464.herokuapp.com/uploads/" +
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
                    //   sx={{ width: "15vw", height: "8vh" }}
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
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input type="file" onChange={handleFileSelect1} hidden />
                  </Button>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Aadhar
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input type="file" onChange={handleFileSelect2} hidden />
                  </Button>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    PAN
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input type="file" onChange={handleFileSelect3} hidden />
                  </Button>
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
    </>
  );
};

export default VendorTenderDetails;
