import {
  Autocomplete,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../api/apiSlice";
import { applyFilter, clearFilter } from "../posts/filtersSlice";

interface IOption {
  userId: string;
  name: string;
  postCount: number;
}

// FIX: make use name selected option render good.
const UserSearch = () => {
  const [name, setName] = useState<string>("");
  const dispatch = useDispatch();
  const [selectedName, setSelectedName] = useState<IOption>({
    userId: "",
    name: "",
    postCount: 0,
  });
  const [options, setOptions] = useState<IOption[]>([]);
  const [suggestions, setSuggestions] = useState<
    { name: string; postCount: number }[]
  >([]);
  const bringName = async () => {
    try {
      const value = name.trim();
      const regex = `^${value}`;
      if (value.length > 0) {
        const res = await axios.get(
          `${BASE_URL}/users/?regex=${regex}&postCount=true`,
          {
            withCredentials: true,
          },
        );
        if (res.status === 200) {
          const users: IOption[] = res.data.users;
          setOptions(() => users);
          setSuggestions(() => {
            return users.map((user) => ({
              name: user.name,
              postCount: user.postCount,
            }));
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
        value={selectedName.name}
        noOptionsText="No Such User"
        onChange={(_, newValue: null | IOption) => {
          setOptions(newValue ? [newValue, ...options] : options);
          if (newValue) setSelectedName(newValue);
          // else setSelectedName(null);
          if (newValue)
            dispatch(applyFilter({ fitlerBy: "name", value: newValue.name }));
          else {
            // setSelectedName(null);
            dispatch(clearFilter({ fitlerBy: "name" }));
          }
        }}
        onInputChange={(_, newInputValue) => {
          if (!newInputValue) {
            setSelectedName([]);
          }
          setName(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search Posts By Users" fullWidth />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              {/* <Grid container alignItems="center"> */}
              {/*   <Grid */}
              {/*     item */}
              {/*     sx={{ width: "calc(100% )", wordWrap: "break-word" }} */}
              {/*   > */}
              <Stack
                display={"flex"}
                flexDirection={"row"}
                width={"100%"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
                alignItems={"center"}
              >
                <Typography variant="body2" color="text.secondary">
                  {option.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  posts {option.postCount}
                </Typography>
              </Stack>
              {/*   </Grid> */}
              {/* </Grid> */}
            </li>
          );
        }}
      />
    </FormControl>
  );
};

export default UserSearch;
