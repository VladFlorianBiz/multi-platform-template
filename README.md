# Template App Documentation


## Overview
This is a full-stack template app designed for rapid, high-quality, and cost-effective multi-platform application development. It leverages a suite of pre-built modules to deliver a seamless user experience across iOS, Android, and web platforms.


## Techhnology
See Full details: [Link](https://docs.google.com/document/d/1ReMj2vs5D_oUVvl9dI79yEFvpVG9cxdlOTUxDPNeGLU/edit?usp=sharing) 
- **Ionic**: Ionic enables seamless cross-platform app development, allowing me to write code once and deploy it on multiple platforms, including iOS, Android, and web. This approach significantly reduces development time and ensures consistency across all devices. Instead of having 3 different teams coding in 3 different languages you can code it in one language and compile it everywhere
- **Angular**: Modern Javascript framework to create dynamic, responsive applications. Angular's robust architecture and component-based structure allow for efficient development of high-quality, maintainable, and scalable applications.
- **NgRx**: Utilizing NgRx, a state management library designed for Angular, I ensure a predictable and efficient handling of application state. This results in more robust, easier to maintain, and debuggable applications, following the principles of reactive programming. This integration pattern is inspired by Martin Fowler’s book called “Enterprise Integration Patterns”
- **Firebase**: Firebase is a game-changer in backend services, enabling rapid development with features like authentication, real-time databases, backend cloud function deployment, authentication,  and hosting. It's cost-effective, scalable, and reduces the need for backend infrastructure management.
- **Angular Schematics**: My custom Angular Schematics scripts enable me to automate and expedite the development process for any feature and implements and integrates all the functionality of basic CRUD(Create, Read, Update, Delete) operations for that feature . These scripts ensure consistency, adhere to best practices, and significantly reduce manual coding efforts. They also generate pages for that feature(List page, Create page, and Detail page) that are responsive for all platforms and all screen sizes 

## Prerequisites
Detailed instructions with screenshots can be found here: [Link](https://docs.google.com/document/d/1JODsQLV2i6AjLIvSOeF_8bciseO5AIxzV-x6ocwqvzs) 
- Node.js (v16 or higher)
- Firebase CLI installed and configured 
- Ionic CLI installed and configured
- Firebase project created and plan upgraded


## Setup and Installation
Detailed set up instructions with screenshots can be found here [Link](https://docs.google.com/document/d/1JODsQLV2i6AjLIvSOeF_8bciseO5AIxzV-x6ocwqvzs) 
1. Ensure Node.js (v16 or higher), Firebase CLI and Ionic CLI are installed.
2. Clone or fork the the repository
3. Open up terminal or gitbash in root project directory
4. Install all dependencies `npm install` 
5. Create 2 environment files under `src/environments/environment.prod.ts` && `src/environments/environment.ts` which should have the content/structure from this file(`src/environments/environment.example.ts`) copied into it and both new files will look the same
6. updated your environment files with your firebase project configuration variables found in firebase dashboard
7. ctrl + shift + f the text `firebase-app-name` and replace all occurrences with your firebase project id


## Commands
- Install Project Dependencies - `npm install`
- Start App - `npm run start`
- Deploy App - `npm run deployProd`
- Generate Full CRUD Feature - `npm run genFeatureWithPagesAndMedia`
- Generate Page - `npm run genPage`
- Generate Service - `npm run genService`
- Generate Data Model - `npm run genModel`
- Generate Component - `npm run genComponent`
- Generate Service - `npm run genService`

## Command Notes
- if running npm run genFeatureWithPagesAndMedia and you want to be able to access the new list page/create/update you can find it at http://localhost:8100/newFeatureName/list where newFeatureName is the name of the newly created feature you can also add a button to side menus found under important files section, make sure to add it to the logic file + the view file.

## Important Shared Helpers
- src/app/shared/helpers/ui-helper.ts  - convenience functions for UI such as showLoader or hideLoader etc
- src/app/shared/helpers/date.helper.ts  - convenience functions for generating time object with these fields week, month, year, quarter, day, timestamp 

## Important Files
- src/app/core/pages/home  - Home Page
- src/app/core/components/side-menu  - mobile view of side menu
- src/app/core/components/side-nav-bar  - desktop view of side menu  
- src/app/core/components/top-nav-bar  - desktop view of menu on home page

## Root Container/Module
- src/app/app-routing-modules.ts  - all features starting route can be defined here as well as lazy loading features
- src/app/app.modules.ts  - anything that needs to be imported on app start usually feature's data store will be eagerly imported here 
- src/app/app.component.html  - main app page container holding all other pages
- src/app/app.component.ts  - main app container logic
