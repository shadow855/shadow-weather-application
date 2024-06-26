# Instructions on how to run the application locally.
Live Link of the Application-> https://shadow-weather-application.onrender.com

Just pull the repository with git and open the code on VS Code and run the code with `npm start`.

## In case of some error (May be some installed packages won't work, so you need to reinstall them).
1. For Chakra UI-> npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
2. For Chakra Icons-> npm i @chakra-ui/icons
3. For axios-> npm i axios
4. For moment-> npm i moment
5. For React Router Dom-> npm i react-router-dom   (I have installed earlier but there is no need to install it).
6. For React Icons-> npm i react-icons

Now, after installing all of them, restart the react application with `npm start`.
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Brief description of the approach and technologies used.

1. I used React.js for making the frontend of the website and OpenWeatherMap wesbite for getting API_KEY for fetching the weather data.
2. I first designed the functions and methods for fetching the weather data with the help of API, then I created the design to display that data.
3. I used Chakra Toast to handle the errors and to show notifications.
4. I used stackoverflow, to resolve some of the errors I faced while making the website.
5. I used VS Code for creating the website.
6. Honestly, there is just one issue but it has no effect on the website, the website is still working correctly. The issue is that-> Although I've handled the error in case the weather data isn't fetched, the console still shows a 404 (Not Found) error. This occurs because Axios continues to fetch data even after the error is handled. However, this error doesn't impact the functionality of the website; it continues to work correctly. As I need to submit the project now, I'll investigate and resolve this error later to keep the console clean.
7. Regarding project limitations, I don't believe there are any. Users can search for any number of locations, and the data is displayed accordingly. Additionally, they can delete specific weather data. While there may be some functionalities that haven't yet crossed my mind, I'm open to implementing more features if I come up with new ideas.
