# :mortar_board: ePromotor - Mobile App

Mobile application created with React Native. It's working with [this API](https://github.com/tmatuszewski97/e-promotor-backend) and supports the registrations process to academic supervisors at the University of Warmia and Mazury in Olsztyn at Faculty Of Mathematics And Computer Science.

## :link: Table of Contents
- [General Informations](#pill-general-informations)
- [Technologies Used](#wrench-technologies-used)
- [Features](#pencil-features)
- [Screenshots](#mag-screenshots)
- [Setup](#hammer-setup)
- [Usage](#page_facing_up-usage)

## :pill: General Informations

The project was made as a part of my Engineering Thesis. Created system takes care about correct conduct of promoter elections and accelerates this process. Moreover, the app offers other [features](#pencil-features), depending on role of logged user. The primary target platforms of the system are Android or iOS mobile devices.

## :wrench: Technologies Used

- [Node.js](https://nodejs.org/en/) (version: 14.15.4)
- [Expo](https://github.com/expo/expo) (version: 40.0.1)
- [React](https://github.com/facebook/react) (version: 16.13.1)
- [React Native](https://github.com/facebook/react-native) (downloaded from expo repository [here](https://github.com/expo/react-native/archive/sdk-40.0.1.tar.gz))
- [React Native Paper](https://github.com/callstack/react-native-paper) (version: 1.3.3)
- [React Native Animatable](https://github.com/oblador/react-native-animatable)  (version: 1.3.3)
- [React Native Mime Types](https://github.com/Liroo/react-native-mime-types) (version: 1.3.3)
- (...) and some other less important libraries (you can find all requirements in [package.json](package.json) file)

## :pencil: Features

1. Main features:
   - Elections are divided into tours. If student will not be able to find a promoter in a given tour, he will go to the next one.
   - The whole process continues until assignment every student to promoter (or disqualification the inactive ones).

2. Features for all types of users:
   - Login / logout function.
   - Changing password.
   - Checking elections status.

3. Features for employees of a dean's office:
   - Registering promoters or students from .csv file.
   - Management of promoters' or students' accounts (edition/deletion).
   - Sharing files between specified user group (allowed groups: employees of dean's office / promoters / students).
   - Management of files belonging to logged user or his group.
   - Disqualification of inactive students.
   - Exporting final data to .csv file (the file contains list of students - associated with selected promoter or disqualified).
   - Changing informations about logged user.

4. Features for promoters:
   - Checking other promoters' profile pages.
   - Sharing files between specified user group (allowed groups: employees of dean's office / promoters / students).
   - Confirming or rejecting students' requests.
   - Changing informations about logged user.

5. Features for students:
   - Selecting other promoter for each of three preferences and sending requests.
   - Showing informations about logged user.

## :mag: Screenshots

| Splash screen  | Login screen |
| :---: | :---: |
| <img src="screenshots/welcome-view.jpg?raw=true" width="300">  | <img src="screenshots/login-view.jpg?raw=true" width="300"> |

<br>

| List of records <br> (panel for employee of a dean's office)   | List of files <br> (looks almost the same for all users) |
| :---: | :---: |
| <img src="screenshots/dean-worker-list-of-records-view.jpg?raw=true" width="300">  | <img src="screenshots/dean-worker-list-of-files-view.jpg?raw=true" width="300"> |

<br>

| List of promoters <br> (panel for employee of a dean's office)   | Detail view of logged user <br> (looks almost the same for all users) |
| :---: | :---: |
| <img src="screenshots/dean-worker-list-of-promoters-view.jpg?raw=true" width="300">  | <img src="screenshots/dean-worker-user-detail-view.jpg?raw=true" width="300"> |

<br>

| List of records <br> (promoter's panel)   | Elections status dialogs <br> (looks the same for all users) |
| :---: | :---: |
| <img src="screenshots/promoter-list-of-records-view.jpg?raw=true" width="300">  | <img src="screenshots/elections-status-1.png?raw=true" width="300"> <br> <img src="screenshots/elections-status-2.png?raw=true" width="300"> <br> <img src="screenshots/elections-status-3.png?raw=true" width="300">|

<br>

| List of records before sending requests <br> (student's panel)   | List of available promoters <br> (student's panel) |
| :---: | :---: |
| <img src="screenshots/student-list-of-records-before-send-view.jpg?raw=true" width="300">  | <img src="screenshots/student-list-of-promoters-view.jpg?raw=true" width="300"> |

<br>

| Promoter detail - part 1 <br> (student's panel)   | Promoter detail - part 2 <br> (student's panel) |
| :---: | :---: |
| <img src="screenshots/student-promoter-detail-1-view.jpg?raw=true" width="300">  | <img src="screenshots/student-promoter-detail-2-view.jpg?raw=true" width="300"> |

<br>

| List of records after sending requests <br> (student's panel)   | List of records - result <br> (student's panel) |
| :---: | :---: |
| <img src="screenshots/student-list-of-records-waiting-view.jpg?raw=true" width="300">  | <img src="screenshots/student-list-of-records-result-view.jpg?raw=true" width="300"> |

## :hammer: Setup

All you need to do is:
1. Download latest [Node.js](https://nodejs.org/en/download/) and [Git](https://git-scm.com/) version if you want to get project by using clone command.
2. Open command line interface.
3. Run the following command: ```npm install -g expo-cli``` to install Expo CLI command line utility.
4. Clone this repo to your desktop with ```git clone https://github.com/tmatuszewski97/e-promotor-mobile-app.git``` command, go to the root directory of project and run ```expo install``` to install his dependencies.
5. Now you can use ```expo start``` command to start the development server.
6. Once the command start, you are able to use browser (```press w on keyboard```) / android emulator (```press a on keyboard```) or iOS emulator (```press i on keyboard```) to run application. For android emulator you can use [Android Studio](https://developer.android.com/), for iOS - [Xcode](https://developer.apple.com/xcode/).

:heavy_exclamation_mark:
**Application will not be able to show you all functionalities untill you install API from [this](https://github.com/tmatuszewski97/e-promotor-backend) repository.**
:heavy_exclamation_mark:

## :page_facing_up: Usage

Before you see working app, you need to:
1. Download Expo on your mobile device. For android, you can find it [here](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pl&gl=US), for iOS - [here](https://apps.apple.com/pl/app/expo-go/id982107779?l=pl).
2. Open Expo app and scan the QR code from image or use https://expo.io/@johnytomala/ePromotor link to find my project.
   <br>
   <img src="screenshots/qr-code.jpg?raw=true" width="150">
3. Now you are able to open newly added app.
4. Choose which type of user you want to test and use specified credentials in login form:
   - for employee of a dean's office:
     - email: anowak_dziekanat@uwm.pl
     - password: Nowak@123
   - for promoter:
     - email: jandrzejczuk@uwm.pl
     - password: Andrzejczuk@4
   - for student:
     - email: 145789@uwm.pl
     - password: $JacKot789
