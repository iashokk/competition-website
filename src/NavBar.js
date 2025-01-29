import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Stack,
  InputBase,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Adb as AdbIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  border: "1px solid gray",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "22ch",
      "&:focus": {
        width: "45ch",
      },
    },
  },
}));

const pages = [
  { label: "Hackathons", path: "/hackathons" },
  { label: "Mentors", path: "/mentors" },
  { label: "Internships", path: "/internships" },
  { label: "Blog", path: "/blogs" },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu(); // Close the menu after navigation
  };

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
    } else {
      setFilteredResults(
        pages.filter((page) =>
          page.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);
  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ backgroundColor: "white" }}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            ICCIS
          </Typography>

          {/* Search Box */}
          <Box sx={{ position: "relative" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "black" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ color: "black" }}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            {/* Display Search Results */}
            {filteredResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  backgroundColor: "blue",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 10,
                  width: "100%",
                  borderRadius: 1,
                  mt: 1,
                }}
              >
                {filteredResults.map((result) => (
                  <MenuItem key={result.label} onClick={() => handleNavigate(result.path)}>
                    {result.label}
                  </MenuItem>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  my: 2,
                  color: "black",
                  display: "block",
                  marginRight: 1,
                  marginLeft: 1,
                  fontWeight: 600,
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Stack direction="row" spacing={2}>
              {isLoggedIn ? (
                <Button variant="outlined" onClick={() => navigate("/signin")}>
                  Log out
                </Button>
              ) : (
                <>
                  <Button variant="outlined" onClick={() => navigate("/signin")}>
                    Log in
                  </Button>
                  <Button variant="contained" onClick={() => navigate("/signup")}>
                    Sign up
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


export default Navbar;
