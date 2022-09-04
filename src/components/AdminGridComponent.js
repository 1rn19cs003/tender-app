import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useNavigate } from "react-router-dom";

const AdminGridComponent = () => {
  const tenderName = window.sessionStorage.getItem("tenderName");

  const navigate = useNavigate();

  const logout = () => {
    axios({
      url: "http://localhost:6969/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      // console.log(res);
    });
    navigate("/");
  };

  const [rows, setRows] = React.useState([]);

  React.useEffect(()=>{
    axios({
      url: "http://localhost:6969/all_data",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      // console.log(res);
      const data = [];
      for (var i = 0; i < res.data.length; i++) {
        // console.log(res.data[i].profile.endDate);
        if (res.data[i].tenderName === tenderName && res.data[i].stud.length !== 0) {
          var obj = {
            id: i + 1,
            vendorName: res.data[i].stud[0].profile.name,
            orgName: res.data[i].stud[0].profile.organization,
            phone: res.data[i].stud[0].profile.phoneno,
            tenderValue: res.data[i].profile.tenderValue,
            url: res.data[i].profile.file.path
          };
          data.push(obj);
        }
      }
      setRows(data);
      // console.log(rows);
    });
  }, [])

  const columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 1,
      maxWidth: 80,
    },
    {
      field: "vendorName",
      headerName: "Vendor Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "orgName",
      headerName: "Organization Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "phone",
      headerName: "Phone No.",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "tenderValue",
      headerName: "Tender Value ( in \u20B9 )",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "tenderFile",
      headerName: "Download Tender",
      flex: 1,
      minWidth: 200,
      align: "left",
      renderCell: (params) => {
        return (
          <Box textAlign="center">
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                console.log(
                  "Button clicked by :",
                  params.row.vendorName,
                  params.row.orgName,
                  params.row.url,
                  tenderName
                );
                axios({
                    url: "http://localhost:6969/download",
                    method: "GET",
                    path_url: params.row.url,
                    withCredentials: true,
                    crossDomain: true,
                  }).then((res) => {
                    // console.log(res);
                  });
              }}
            >
              <DownloadRoundedIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

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
                <LoginIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>

        {/* Body */}

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "68vh",
                  backgroundColor: "#D4F1F4",
                }}
              >
                <Typography
                  variant="h5"
                  color="text.primary"
                  sx={{ ml: 2, fontWeight: "bold" }}
                >
                  {tenderName}
                </Typography>
                <br />
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "55vh",
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    components={{
                      Toolbar: GridToolbar,
                    }}
                  />
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AdminGridComponent;
