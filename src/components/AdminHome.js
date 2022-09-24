import * as React from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { useTheme } from "@mui/material/styles";


const AdminHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const logout = () => {
    axios({
      url: "https://tranquil-temple-34464.herokuapp.com/logout",
      method: "GET",
      // withCredentials: true,
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
                Tender Management Portal
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

        {/* Body of Home Page */}
        <Box
          sx={{
            height: "90vh",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <NavLink
              to="/admin/uploadtender"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                sx={{ marginTop: "10rem", paddingX: "5rem", paddingY: "2rem" }}
              >
                Upload Tender
              </Button>
            </NavLink>
            <NavLink to="/admin/viewtender" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{ margin: "2rem", paddingX: "5rem", paddingY: "2rem" }}
              >
                View Tender
              </Button>
            </NavLink>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminHome;
