import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { firebase, auth } from "../firebase";

const theme = createTheme();

const initialValues = {
  vendorName: "",
  orgName: "",
  phone: "",
  otp: "",
  email: "",
  password: "",
  renterpwd: "",
};

// Used for snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const axios = require("axios");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const credentials = {
      //   name: data.get("vendorName"),
      //   organization: data.get("orgName"),
      // phoneno: data.get("phone"),
      // verified: true,
      email: data.get("email"),
      password: data.get("password"),
      // admin: false,
    };
    // window.userVerified = "Yes";              //    REMOVE THIS LINE TO RE-ENABLE OTP VERIFICATION
    if (window.userVerified === "Yes") {
      if (credentials.password === data.get("renterpwd")) {
        console.log("Sending API request: ", credentials);
        axios({
          url: "https://tranquil-temple-34464.herokuapp.com/forgot_password",
          method: "POST",
          // withCredentials: true,
          crossDomain: true,
          data: credentials,
        }).then((res) => {
          console.log(res);
          if (res.data.sucess === true) {
            navigate("/vendor/signin");
          } else {
            console.log("Error ", res);
            setOpen(true);
          }
        });
      } else {
        window.alert("Password and Re-enter Password are not the same!");
        return;
      }
    } else {
      setOpen6(true);
    }
  };

  const [values, setValues] = React.useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value !== "") {
      setValues({
        ...values,
        [name]: value,
      });
    } else {
      setValues({
        ...values,
        [name]: null,
      });
    }
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sendOtpBtn",
      {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha varified");
        },
        defaultCountry: "IN",
      }
    );
  };

  const verifyOTP = () => {
    let code = values["otp"];
    window.result
      .confirm(code)
      .then(() => {
        window.userVerified = "Yes";
        setOpen2(true);
        console.log("OTP Verified");
      })
      .catch((error) => {
        setOpen3(true);
        console.log(error);
      });
  };

  const sendOTP = () => {
    if (values.phone.toString() === "" || values.phone.toString().length < 10)
      return;
    let phoneNumber = "+91" + values.phone.toString();

    configureCaptcha();
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((result) => {
        window.result = result;
        setOpen4(true);
        console.log("OTP has been sent");
      })
      .catch((error) => {
        setOpen5(true);
        console.log("SMS not sent");
        window.location.reload();
      });
  };

  // -----Opening and Closing snackbars-----
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [open6, setOpen6] = React.useState(false);

  // ---------------------------------------

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
    setOpen6(false);
  };

  return (
    <ThemeProvider theme={theme}>
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
              Forgot Password
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              type="phone"
              fullWidth
              label="Phone Number (+91)"
              name="phone"
              value={values.phone}
              onChange={handleInputChange}
            />
            <div id="recaptcha-container"></div>
            <Button
              xs="true"
              variant="outlined"
              id="sendOtpBtn"
              onClick={() => {
                sendOTP();
              }}
            >
              Send OTP
            </Button>

            <TextField
              xs="true"
              margin="normal"
              required
              fullWidth
              label="Enter OTP"
              name="otp"
              value={values.otp}
              onChange={handleInputChange}
            />
            <Button xs="true" variant="outlined" onClick={verifyOTP}>
              Verify
            </Button>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              value={values.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              value={values.password}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="renterpwd"
              label="Re-enter New Password"
              type="password"
              value={values.renterpwd}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Account does not exist
        </Alert>
      </Snackbar>
      <Snackbar open={open2} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          OTP Verified
        </Alert>
      </Snackbar>
      <Snackbar open={open3} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          OTP Invalid
        </Alert>
      </Snackbar>
      <Snackbar open={open4} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          OTP sent successfully
        </Alert>
      </Snackbar>
      <Snackbar open={open5} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          OTP not sent
        </Alert>
      </Snackbar>
      <Snackbar open={open6} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Phone Not Verified
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ForgotPassword;
