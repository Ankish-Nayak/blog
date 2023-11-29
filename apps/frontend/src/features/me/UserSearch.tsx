import {
  Autocomplete,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/apiSlice";
import { useDispatch } from "react-redux";
import { applyFilter, clearFilter } from "../posts/filtersSlice";

interface IUser {
  _id: string;
  name: string;
}

const UserSearch = () => {
  const [name, setName] = useState<string>("");
  const dispatch = useDispatch();
  const [selectedName, setSelectedName] = useState<IUser>({
    _id: "",
    name: "",
  });
  const [options, setOptions] = useState<IUser[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bringName = async () => {
    try {
      const value = name.trim();
      const regex = `^${value}`;
      if (value.length > 0) {
        const res = await axios.get(`${BASE_URL}/users/?regex=${regex}`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          const users: IUser[] = res.data.users;
          setOptions(() => users);
          setSuggestions(() => {
            return users.map((user) => user.name);
          });
        }
      } else {
        setOptions([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    bringName();
  }, [name]);

  return (
    <FormControl
      variant="standard"
      sx={{
        bgcolor: "inherit",
        borderRadius: "20px",
      }}
    >
      <Autocomplete
        id="search posts by user"
        sx={{ width: 300, bgcolor: "#f0ece5", borderRadius: "20px" }}
        // getOptionLabel={(option) =>
        //   typeof option === "string" ? option : option.description
        // }
        filterOptions={(x) => x}
        options={suggestions}
        autoComplete
        includeInputInList
        filterSelectedOptions
        // defaultValue={}
        // value={selectedName}
        noOptionsText="No Such User"
        onChange={(_, newValue: null) => {
          setOptions(newValue ? [newValue, ...options] : options);
          if (newValue) setSelectedName(newValue);
          if (newValue)
            dispatch(applyFilter({ fitlerBy: "name", value: newValue }));
          else {
            dispatch(clearFilter({ fitlerBy: "name" }));
          }
        }}
        onInputChange={(_, newInputValue) => {
          setName(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search Posts By Users" fullWidth />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Grid
                  item
                  sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {option}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </FormControl>
  );
};

export default UserSearch;
