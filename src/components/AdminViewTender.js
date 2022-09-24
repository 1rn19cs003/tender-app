import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";

const AdminViewTender = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = React.useState([]);
  const [tenderDropdown, setTenderDropDown] = React.useState([]);
  const logout = () => {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      // console.log(res);
      if (res.data.isLogged === false) {
        return;
      } else {
      }
    });
    navigate("/");
  };

  const currentDate = new Date();

  React.useEffect(() => {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/all_data",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      console.log("-----------res data----------------", res);
      const data = [];
      for (var i = 0; i < res.data.length; i++) {
        var obj = {
          tenderName: res.data[i].tenderName,
          endDate: res.data[i].profile.endDate,
        };

        var isNewData = 1;
        for (var j = 0; j < data.length; j++) {
          let tenderEndDate = new Date(obj.endDate);
          if (
            data[j].tenderName.trim() === obj.tenderName.trim() ||
            currentDate < tenderEndDate
          )
            isNewData = 0;
        }
        if (isNewData) data.push(obj);
      }
      setTenders(data);

      // Dropdown Menu
      const temp_data =
        tenders.length > 0 &&
        tenders.map((item, index) => {
          return (
            <MenuItem key={index} value={item.tenderName}>
              {item.tenderName}
            </MenuItem>
          );
        });
      setTenderDropDown(temp_data);
    });
  });

  // Redirect and Display Tender
  const displayTender = (e) => {
    const { name, value } = e.target;
    //console.log("Display Tender : ", value);

    window.sessionStorage.setItem("tenderName", value);

    navigate("./tender");
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
                View Tender
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

        {/* Body */}

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={8} sx={{}}>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="tender-name-label">Select Tender</InputLabel>
                <Select
                  labelId="select-tender-name-label"
                  name="selectTenderName"
                  onChange={displayTender}
                >
                  {tenderDropdown}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AdminViewTender;
