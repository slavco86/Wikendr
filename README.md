# Wikendr App Beta 1.0
## Overview
Wikendr is leisure aggregator service that allows users to plan their weekends based on location, time available with added benefit of being able to contact and meet other people interested in same leisure types.
### What is this app for?
This app is for searching local leisure activities based on user interest preference, gps location and time avaialable for travelling. 
### What does it do?
This app contains a set number of real service providers, registered with Google Maps. It allows user to enter search terms and browse through available leisure activities that match their search terms
### How does it work?
This app compares search terms with service objects and displays relevant services as search results. The app makes API call to Google Maps to display location of any given service and time it takes to travel to this location, based on current users GPS together with other relevant data. So far, this app has no backend so the catalogue of services is stored locally and eveything is being run on the client side.
## Features
### Existing features
- User Based Features
    - Registration - Firebase backend
    - Login - Firebase backend, just loading pre-existing user profile for demonstration purpose only
    - Logout - offloading user profile to allow for another user profile to be loaded up
    
Full user registration/athentication/login/logout functionality implemented. User can register, using registration form with extensive validation rules and dynamic helpobex to help user submit valid registration. User can upload their profile picture, select their interests and write something about themselve. Upon registration, user will be redirected to thei profile page. User can view their profile, including profile photo in the top level menu, under User Profile, by clicking on their profile picture image in the nav bar. User Profile modal will display their individual profile with information that they have entered on registration.
### Features left to implement
- Service Based Features
    - Search through Services available - display a filteres list of pre-existing services based on matching keywords
    - Viewing individual Services offered - calling API to calculate and display distance, location and other available info by matching pre-existing service with services available through API
    - Browsing Groups of Services based on user preference - combining services and dynamically displaying them based on the loaded user profile
## Tech Used
### Some of the tech used includes:
- [AngularJS](https://angularjs.org/)
    - We use **AngularJS** to handle page routing, we also use it to make calls to the REST API and build custom directives
- [Bootstrap](http://getbootstrap.com/)
    - We use **Bootstrap** to give our project a simple, responsive layout
- [NPM](https://bower.io/)
    - We use **npm** to help manage some of the dependencies in our application
- [bower](https://bower.io/)
    - **Bower** is used to manage the installation of our libraries and frameworks
## Contributing
 
### Getting the code up and running
1. Firstly you will need to clone this repository by running the ```git clone <project's Github URL>``` command
2. After you've that you'll need to make sure that you have **npm** and **bower** installed
  1. You can get **npm** by installing Node from [here](https://nodejs.org/en/)
  2. Once you've done this you'll need to run the following command:
     `npm install -g bower # this may require sudo on Mac/Linux`
3. Once **npm** and **bower** are installed, you'll need to install all of the dependencies in *package.json* and *bower.json*
  ```
  npm install
 
  bower install
  ```
4. After those dependencies have been installed you'll need to make sure that you have **http-server** installed. You can install this by running the following: ```npm install -g http-server # this also may require sudo on Mac/Linux```
5. Once **http-server** is installed run ```http-server -c-1```
6. The project will now run on [localhost](http://127.0.0.1:8080)
7. Make changes to the code and if you think it belongs in here then just submit a pull request