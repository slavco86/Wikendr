# Wikendr App Beta 1.0
## Overview
Wikendr is leisure aggregator service that allows users to plan their weekends based on location, time available with added benefit of being able to contact and meet other people interested in same leisure types.
### What is this app for?

### What does it do?

### How does it work?

## Features
### Existing features
    - None yet!
### Features left to implement
- User Based Features
    - Registration - no backend, just form validation
    - Login - no backend, just loading pre-existing user profile for demonstration purpose only
    - Logout - offloading user profile to allow for another user profile to be loaded up
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