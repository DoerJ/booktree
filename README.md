# Booktree
An online second-handed textbooks trade platform for university students
#### Description 
Booktree is an online second-handed textbooks trade platform for university students. The application aims to encourage the students to pass their used textbooks to the others, and find their needed textbooks through the others for the new semester. Booktree is designed and built in iOS, Android, and Web. 
#### Functionalities
- User authentication
- Email verification for account signup
- Textbook list sorted by date on homepage
- Search textbook by bookname/school
- Post book online
- Image upload
- Display the detailed info of the textbook
- Confirm the transaction
- Display the buyer list
- Cancel/delete transaction on buyer page
- Display the posted books and pending transactions on aboutMe page
- Push notification
- Badge icon on navigation bar
#### How to run it?
1. git clone https://github.com/DoerJ/Booktree.git
2. cd Booktree
3. run npm install
4. Open one more terminal windows under the current directory, run **node server.js** and **npm start** in two terminal windows respectively
#### The project team
Booktree is designed and built as a scalable application that contains a fair amount of features, backup with Firestore database, and developed in iOS, Android, and Web. Therefore, the teamwork is needed to achieve all of these. The reponsiibilities of the team are as follow:
- **Requirement engineering:** James He, Leo Shang
- **Workflow design(UML):** James He, Leo Shange
- **Database design:** James He, Leo Shang
- **UI design for iOS, Android, and Web:** James He
- **iOS development:** Annie(features in js)
- **Android development:** Leo Shange(features in Java), Chang Liu(UI in xml)
- **Web development:** James He(features in js), Steve(UI in CSS)
#### The stacks for Web development
- **Authentication**: Firebase Auth
- **Front-end:** React.js
- **Back-end:** Express.js + Firestore
- **Data interaction API:** Ajax
- **UI**: Adobe Illustrator(images) + JSX + CSS
#### Project category
<pre>
|--booktree                   // root
  |--package-lock.json
  |--package.json                   // dependency file
  |--public
    |--firebase-messaging-sw.js                   // give the service worker the access to the Firebase Messaging
    |--index.html                   // the default html page
    |--manifest.json
  |--server.js                    // node server configuration
  |--src
    |--App.css
    |--App.js                   // entry of the js files
    |--App.test.js
    |--index.css                    // the default css page
    |--index.js                   // the default js page
    |--serviceWorker.js                   // proxy configuration
    |--CloudStorage
      |--gs.js
      |--keyfile.json
    |--Component                    // react component folder
      |--BookDetailedInfo.js                    // book info page
      |--CreateBook.js                    // post book
      |--DefaultIndexList.js                    // home page
      |--Login.js                   // log in
      |--MainEntry.js                   // landing page
      |--Me.js                    // about me
      |--MyBuyers.js                    // my buyers
      |--NavigationBar.js                   // navigation 
      |--Register.js                    // sign up
    |--Config
      |--Bundle.js                    // loading component in need
      |--RoutesConfig.js                  // routes configuration
    |--Database
      |--auth.js                    // Firebase Auth service configuration
      |--firebase-admin.js
      |--firebase.js                    // Firestore configuration
    |--DataModel
      |--dataModel.js                   // data interaction api
      |--uploadDataModel.js
    |--dataTools
      |--dateDiff.js                    // time calculator
    |--images
    |--LocalStorage                   
      |--localStorage.js                    // local storage api
    |--Multer
      |--multer.js                    
    |--Routes                   // db folder
      |--bookRoutes.js                    // db interactions with Books collection
      |--userRoutes.js                    // db interactions with Users collection
      |--buyerRoutes.js                   // db interactions with CountOnBuyers collection
      |--gsRoutes.js                    
      |--cloudMessageRoutes.js         
    |--style                    // css folder
      |--BookDetailedInfo.css                   // css for book info page
      |--CreateBook.css                   // css for book post page
      |--DefaultIndexList.css                   // css for homepage
      |--login.css                    // css for login page
      |--MainEntry.css                    // css for landing page
      |--Me.css                   // css for about me
      |--MyBuyers.css                   // css for my buyers page
      |--navigationBar.css                    // css for navigation bar
      |--register.css                   // css for signup page
      |--style.css                    // shared css
</pre>
#### Work flow(UML)
The following UML diagram is the high-level presentation of Booktree Web App:
![booktree](https://user-images.githubusercontent.com/30460622/52996334-23e6fc80-33d2-11e9-8d21-ca7682dd9bc3.jpg)
