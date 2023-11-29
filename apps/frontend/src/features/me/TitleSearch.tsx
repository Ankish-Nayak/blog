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
  title: string;
}

const TitleSearch = () => {
  const [title, setTitle] = useState<string>("");
  const dispatch = useDispatch();
  const [selectedTitle, setSelectedTitle] = useState<IUser>({
    _id: "",
    title: "",
  });
  const [options, setOptions] = useState<IUser[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bringName = async () => {
    try {
      const value = title.trim();
      const regex = `^${value}`; // title with starting with
      if (value.length > 0) {
        const res = await axios.get(`${BASE_URL}/posts/title/?regex=${regex}`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          const titles: IUser[] = res.data.titles;
          setOptions(() => titles);
          setSuggestions(() => {
            return titles.map((user) => user.title);
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
  }, [title]);

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
        noOptionsText="No Such Title"
        onChange={(_, newValue: null) => {
          setOptions(newValue ? [newValue, ...options] : options);
          if (newValue) setSelectedTitle(newValue);
          if (newValue)
            dispatch(applyFilter({ fitlerBy: "title", value: newValue }));
          else dispatch(clearFilter({ fitlerBy: "title" }));
          console.log("selected", newValue);
        }}
        onInputChange={(_, newInputValue) => {
          setTitle(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search Posts By Title" fullWidth />
        )}
        renderOption={(props, option) => {
          console.log(props);
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

export default TitleSearch;
