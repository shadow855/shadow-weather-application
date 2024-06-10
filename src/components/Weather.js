
//importing all the components, hooks and images

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Button, Divider, Icon, Image, Input, InputGroup, InputLeftElement, Spinner, Switch, Text, useBreakpointValue, useToast } from '@chakra-ui/react';
import { IoSearchOutline } from "react-icons/io5";
import axios from 'axios';
import '../css folder/wave.css'
import cloud from '../Images/cloud.png'
import fog from '../Images/fog.png'
import rain from '../Images/rain.png'
import snow from '../Images/snow.png'
import storm from '../Images/storm.png'
import sun from '../Images/sun.png'
import windy from '../Images/windy.png'

// Main Weather component
const Weather = () => {

    //declaring state variables to handle states
    const [weatherData, setWeatherData] = useState([]); // Holds the weather data
    const [locations, setLocations] = useState([]); // Holds the locations for the weather data
    const [inputValue, setInputValue] = useState(""); // Holds the input value from the search bar and manages it
    const [images, setImages] = useState([]);// Holds the weather images
    const [isDarkMode, setIsDarkMode] = useState(false); // Toggles between light and dark mode

    // Checks if the screen width is below small size (Chakra UI size sm), then manage the component accordingly
    const isBelowSmall = useBreakpointValue({ base: true, sm: false });

    // Adjusts the placeholder value based on screen size
    const placeholderValue = useBreakpointValue({ base: 'Enter City name...', md: 'Enter city...', lg: 'Enter City name...' });

    const toast = useToast(); // Chakra UI toast for notifications

    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY; // API key for OpenWeather

    // Function to fetch weather data by location
    const getWeatherByLocation = async (location) => {
        // Check if weather data for the location already exists
        if (locations.includes(location)) {
            toast({
                title: `Weather data for ${location} is already fetched.`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${API_KEY}&units=metric`;

        try {
            const response = await axios.get(`${BASE_URL}`);

            // Update state with the fetched weather data, location, and image
            setWeatherData(prevWeatherData => [...prevWeatherData, response.data]);
            setLocations(prevLocations => [...prevLocations, location]);
            setImages(prevImages => [...prevImages, getWeatherImage(response.data.weather[0].description.toLowerCase())]);

            toast({
                title: "Successfully fetched Weather data",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } catch {
            toast({
                title: "Failed to fetch Weather data",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    // Function to handle the search input
    const handleSearch = () => {
        if (inputValue.trim() !== '') {
            getWeatherByLocation(inputValue);
            setInputValue("");
        }
    };

    // Function to fetch weather data for the current location
    const getCurrentLocationWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`)
                    .then(response => {
                        setWeatherData([response.data]);
                        setLocations([response.data.name]);
                        setImages([getWeatherImage(response.data.weather[0].description.toLowerCase())]);
                    })

                    .catch(error => {
                        console.error("Error fetching current location:", error);
                        toast({
                            title: "Failed to fetch Weather data",
                            status: 'warning',
                            duration: 5000,
                            isClosable: true,
                            position: 'bottom',
                        });
                    });
            },
                (error) => {
                    //Sends a notification if the user hasn't allowed location access
                    toast({
                        title: "Please enable the location to make this application fully functional and refresh the page again.",
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    });
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Function to clear a specific weather entry
    const handleClear = (index) => {
        setWeatherData(prevWeatherData => {
            const updatedWeatherData = prevWeatherData.filter((_, i) => i !== index);

            //if no weather data left, then calls getCurrentLocationWeather() function to show the weather data of current location
            if (updatedWeatherData.length === 0) {
                getCurrentLocationWeather();
            }
            return updatedWeatherData;
        });

        setLocations(prevLocations => prevLocations.filter((_, i) => i !== index));
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    // Fetch weather data for the current location when the component mounts
    useEffect(() => {
        getCurrentLocationWeather();
    }, []);

    // Function to get the appropriate weather image based on the description
    const getWeatherImage = (description) => {
        switch (description) {
            case 'clear sky':
                return sun;
            case 'few clouds':
                return sun;
            case 'scattered clouds':
                return sun;
            case 'broken clouds':
                return cloud;
            case 'overcast clouds':
                return storm;
            case 'light rain':
                return rain;
            case 'moderate rain':
                return rain;
            case 'heavy rain':
                return rain;
            case 'light snow':
                return snow;
            case 'moderate snow':
                return snow;
            case 'heavy snow':
                return snow;
            case 'mist':
                return fog;
            case 'fog':
                return fog;
            default:
                return windy;
        }
    };

    // Function to calculate the heat index
    const calculateHeatIndex = (temp, humi) => {
        const c1 = -42.379;
        const c2 = 2.04901523;
        const c3 = 10.14333127;
        const c4 = -0.22475541;
        const c5 = -6.83783 * 0.001;
        const c6 = -5.481717 * 0.01;
        const c7 = 1.22874 * 0.001;
        const c8 = 8.5282 * 0.0001;
        const c9 = -1.99 * 0.000001;

        const T = temp * 9 / 5 + 32; // Convert temperature to Fahrenheit
        const R = humi;

        const HI = c1 + (c2 * T) + (c3 * R) + (c4 * T * R) + (c5 * T ** 2) + (c6 * R ** 2) + (c7 * T ** 2 * R) + (c8 * T * R ** 2) + (c9 * T ** 2 * R ** 2);
        return (HI - 32) * 5 / 9; // Convert heat index back to Celsius
    };

    // Function to toggle between light and dark mode
    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            {/* Wrapper box for the entire application */}
            <Box
                width="100%"
                minHeight="100vh"
                display="flex"
                flexDirection='column'
                color={isDarkMode ? "white" : "black"}
                bg={isDarkMode ? "rgba(32,31,31)" : "transparent"}
                textAlign="left"
            >

                {/* Header section with welcome text, dark/light theme toggle and search input */}
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    flexDirection={{ base: 'column', md: 'row' }}
                    p={2}
                >

                    {/* Welcome Text */}
                    <Text fontSize={{ base: '18px', sm: '28px', md: '23px', lg: "29px" }} mt={2}>
                        <span className={isDarkMode ? "foggy-text" : "light-text"}> Welcome To Shadow Weather App</span>
                    </Text>

                    {/* Light/Dark Theme toggle and search input */}
                    <Box display='flex' alignItems='center' mt={2}>

                        {/* Light/Dark Theme toggle */}
                        <Text fontSize={{ base: '15px', sm: '20px' }}>
                            {isDarkMode ? "Dark" : "Light"}
                        </Text>
                        <Switch mr={{ base: '3', sm: '5' }} ml={{ base: '3', sm: '5' }} size={{ base: 'sm', sm: 'md' }} isChecked={isDarkMode} onChange={handleThemeToggle} />


                        {/* Search input */}

                        {/* To group search icon and input field together */}
                        <InputGroup>
                            {/* Checks the screen size to be smaller than sm and then removes icon, or else keeps icon if size is more than sm */}
                            {isBelowSmall ? <></> :
                                // To set icon to the left of input field
                                <InputLeftElement>
                                    <Icon
                                        as={IoSearchOutline}
                                        w={6}
                                        h={6}
                                        color={isDarkMode ? "white" : "black"}
                                    /></InputLeftElement>
                            }
                            <Input
                                type='text'
                                placeholder={placeholderValue}
                                backgroundColor={isDarkMode ? "black" : "white"}
                                w={{ base: '180px', sm: '250px', md: '150px', lg: '250px' }}
                                borderColor={isDarkMode ? "white" : "black"}
                                color={isDarkMode ? "white" : "black"}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </InputGroup>

                        {/* Search button */}
                        {/* Checks the screen size to be smaller than sm and then sets icon in place of search button, or else keeps search button if size is more than sm */}
                        {isBelowSmall ? <><Button
                            w={6}
                            onClick={handleSearch}
                            backgroundColor={isDarkMode ? "white" : "black"}
                            color={isDarkMode ? "black" : "white"}
                            _hover={{
                                backgroundColor: isDarkMode ? "#ccc" : "#737373",
                            }}
                        ><Icon
                                as={IoSearchOutline}
                                w={4}
                                h={4}
                                color={isDarkMode ? "black" : "white"}
                            />
                        </Button>
                        </> :
                            <Button
                                onClick={handleSearch}
                                backgroundColor={isDarkMode ? "white" : "black"}
                                color={isDarkMode ? "black" : "white"}
                                _hover={{
                                    backgroundColor: isDarkMode ? "#ccc" : "#737373",
                                }}
                            >
                                Search
                            </Button>
                        }

                    </Box>
                </Box>

                {/* Weather cards section */}
                <Box
                    id='central-div'
                    display='flex'
                    flexWrap='wrap'
                    justifyContent='center'
                    alignItems='center'
                >
                    {weatherData.length > 0 ? weatherData.map((weather, index) => {
                        // Destructuring weather data
                        const { name, main, weather: weatherDetails, wind } = weather || {};
                        // Extracting relevant weather information
                        const temperature = main?.temp;
                        const humidity = main?.humidity;
                        const windSpeed = ((wind?.speed) * 3.6)?.toFixed(2);
                        const description = weatherDetails?.[0]?.description;
                        const currentDate = moment().format('MMMM Do YYYY');
                        const currentTime = moment().format('h:mm a');
                        const heatIndex = calculateHeatIndex(temperature, humidity)?.toFixed(2);
                        const image = images[index];

                        return (
                            // Individual weather card
                            <Box
                                key={index}
                                backgroundColor={isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.8)"}
                                backdropFilter="blur(3px)"
                                borderRadius="10px"
                                padding="20px"
                                color={isDarkMode ? "black" : "white"}
                                w={{ base: '300px', sm: '400px' }}
                                m="30px 10px 0 10px"
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                textAlign='center'
                            >

                                {/* Weather image and temperature */}
                                <Box
                                    mt={35}
                                    mb={5}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-around'
                                >

                                    <Image src={image} />
                                    <Text fontSize={50} fontWeight={500}>{temperature} &deg;C</Text>
                                </Box>

                                {/* Location name and weather description */}
                                <Text fontSize={30} fontWeight={500}>{name}</Text>
                                <Text mt={1}>Weather: {description}</Text>

                                {/* Date and time */}
                                <Box
                                    pl={4}
                                    pr={9}
                                    mt={8}
                                    mb={4}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                >
                                    <Text fontSize={15}>{currentDate}</Text>
                                    <Text fontSize={15}>{currentTime}</Text>
                                </Box>

                                {/* Wind speed and humidity */}
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    flexDirection={{ base: 'column', sm: "row" }}
                                >
                                    <Box
                                        borderRadius={10}
                                        width={150}
                                        backgroundColor={isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"}
                                        color={isDarkMode ? "white" : "black"}
                                        mb={{ base: '3', sm: '0' }}
                                    >
                                        Wind Speed
                                        <Text>{windSpeed} km/h</Text>
                                    </Box>

                                    <Box
                                        borderRadius={10}
                                        width={150}
                                        backgroundColor={isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"}
                                        color={isDarkMode ? "white" : "black"}
                                    >
                                        Humidity
                                        <Text>{humidity} %</Text>
                                    </Box>
                                </Box>

                                {/* Heat index */}
                                <Box
                                    mt={6}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    pl={1}
                                    pr={1}
                                >
                                    <Text>Heat Index</Text>
                                    <Text>{heatIndex}</Text>
                                </Box>

                                <Divider mt={5} mb={3} borderColor={isDarkMode ? "black" : "white"} />

                                {/* Button to clear weather card*/}
                                <Button
                                    backgroundColor={isDarkMode ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)"}
                                    borderRadius="10px"
                                    fontSize={25}
                                    color={isDarkMode ? "black" : "white"}
                                    padding="10px 20px"
                                    onClick={() => handleClear(index)}
                                    _hover={{
                                        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                                    }}
                                >Clear</Button>
                            </Box>
                        );
                    }) : <Spinner />}
                </Box>
            </Box >
        </>
    );
};

export default Weather;
