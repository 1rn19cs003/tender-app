import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Stack from "@mui/material/Stack";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { NavigateBefore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminCardComponent = ({ data }) => {
  const deleteTender = (tenderName) => {
    // console.log("Delete Tender : ", tenderName);

    if (window.confirm("Are you sure? All files for tender \"" + tenderName + "\" will be deleted.")) { 
    axios
      .delete("https://tranquil-temple-34464.herokuapp.com/delete_file", {
        data: {
          tenderName: tenderName,
        },
      })
      .then((res) => {
        window.location.reload();
      });

    axios
      .delete("https://tranquil-temple-34464.herokuapp.com/delete_tender", {
        data: {
          tenderName: tenderName,
        },
      })
      .then((res) => {
        window.location.reload();
      });
    }
  };

  return (
    <>
      {data.map((data, index) => {
        return (
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 170,
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
                    <TextField
                      value={data.startDate}
                      color="primary"
                      label="Start Date"
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      value={data.endDate}
                      color="primary"
                      label="End Date"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Stack>
                  <br></br>
                  <br></br>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    color="error"
                    onClick={() => {
                      deleteTender(data.tenderName);
                    }}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        );
      })}
    </>
  );
};

export default AdminCardComponent;
