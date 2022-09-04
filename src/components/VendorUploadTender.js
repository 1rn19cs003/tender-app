import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import VendorCardComponent from "./VendorCardComponent";

const VendorUploadTender = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [data, setData] = React.useState([]);

  const currentDate = new Date();

  React.useEffect(() => {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/all_admin_data",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      console.log(res);
      let temp_data = [];
      for (let i = 0; i < res.data.length; i++) {
        const obj = {
          tenderName: res.data[i].tenderName,
          startDate: res.data[i].profile.startDate,
          endDate: res.data[i].profile.endDate,
        };

        // Comment these 3 statements if all available tenders are to be shown under Vendor Upload
        // const sDate = new Date(obj.startDate);
        // const eDate = new Date(obj.endDate);
        // if (currentDate > sDate && currentDate < eDate) temp_data.push(obj);
      }

      setData(temp_data);
    });
  }, []);

  const logout = () => {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      console.log(res);
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

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <VendorCardComponent data={data} />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default VendorUploadTender;
