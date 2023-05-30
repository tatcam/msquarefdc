import { useContext, useState } from "react";
import Layout from "./Layout";
import { AppContext } from "../contexts/AppContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import { config } from "../config/config";
import { IndexKind } from "typescript";
import { Location } from "../typings/types";

const Locations = () => {
  const { locations, fetchData, company } = useContext(AppContext);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    companyId: company?.id,
  });
  const [isUpdate, setItUpdate] = useState<boolean>(false);

  const [updateLocation, setUpdateLocation] = useState<Location>({
    id: undefined,
    name: "",
    address: "",
  });
  const accessToken = localStorage.getItem("accessToken");
  const canUpdate = updateLocation.name || updateLocation.address;

  const createNewLocation = async () => {
    await fetch(`${config.apiBaseUrl}/locations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLocation),
    });
    fetchData();
    setNewLocation({ name: "", address: "", companyId: company?.id });
  };

  const updateLocationFunction = async (location: Location) => {
    console.log(location);

    if (!updateLocation.name && !updateLocation.address)
      return alert("please change location or address");

    if (location.id !== updateLocation.id)
      return alert("please make sure the right location");

    const locationsId = location.id;
    await fetch(`${config.apiBaseUrl}/locations/${locationsId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateLocation),
    });
    fetchData();
    setUpdateLocation({
      id: undefined,
      name: "",
      address: "",
    });
  };

  const deleteLocationFunction = async (location: Location) => {
    setItUpdate(true);
    console.log("rensered...", isUpdate);

    const locationsId = location.id;
    const response = await fetch(
      `${config.apiBaseUrl}/locations/${locationsId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      return fetchData();
      setItUpdate(false);
      console.log("rensered...", isUpdate);
    }
    alert(
      "Cannot delete this location. Please delete menus associated with it first."
    );
  };

  return (
    <Layout title="Locations">
      <Box sx={{ ml: 3, mt: 5 }}>
        {locations.map((location, index) => {
          return (
            <Box
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
              key={index}
            >
              <Typography variant="h5" sx={{ mr: 3 }}>
                {index + 1}.
              </Typography>
              <TextField
                defaultValue={location.name}
                sx={{ mr: 3 }}
                onChange={(evt) =>
                  setUpdateLocation({
                    ...updateLocation,
                    name: evt.target.value,
                    id: location.id,
                  })
                }
              />
              <TextField
                defaultValue={location.address}
                sx={{ mr: 3 }}
                onChange={(evt) =>
                  setUpdateLocation({
                    ...updateLocation,
                    address: evt.target.value,
                    id: location.id,
                  })
                }
              />
              <Button
                variant="contained"
                onClick={() => updateLocationFunction(location)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                onClick={() => deleteLocationFunction(location)}
              >
                Delete
              </Button>
            </Box>
          );
        })}
        <h1>Create New Location</h1>
        <Box sx={{ ml: 5, display: "flex", alignItems: "center" }}>
          <TextField
            value={newLocation.name}
            sx={{ mr: 3 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            value={newLocation.address}
            sx={{ mr: 3 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, address: evt.target.value })
            }
          />
          <Button variant="contained" onClick={createNewLocation}>
            Create
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Locations;
