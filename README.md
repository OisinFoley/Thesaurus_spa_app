# Web app acting as a thesaurus, allowing users to search for words, as well as add their own.

#### README file 1.1.6


To run:

1) Go to root and 
`node app.js`

Requirements:

- NodeJs and MongoDb are required to be installed locally on your machine

---

Bugs:
I'm sure some will come later...

---

Added in previous commits::

(1.1.6)
- mainCtrl has function getUserInfo(), which is available to different views throughout the app
- Added request pre-processor in mainModule.js, which points to new factory called "authInterceptor". In this factory, we get for a token in the browser, and if it exists we had it as a header to the request.
- Our API has a new path (/api/user/info) which decodes the token, exposing the users info in our mainCtrl
- User's name is displayed in nav bar when logged in.
- Client-side validation of form inputs onkeypress and also once focus is lost(ng-blur)
	- Checking that input isn't null(!$pristine) when focus is lost before displaying any error messages
- Setup a directive which watches the value of a "confirmPassword" input, and compares it with the value of "password". If they don't match, a message is displayed to the client. This updates on keypress.
- When focus is lost on username and email inputs, a checkingEmail/checkingUsername $scope variable is set to true which toggles the visibility of a spinning load icon. The server then checks if the email and username values exist in the DB. This "checking" variable will be set to false when we get a response from the server, and compensates for users with slow connections.
	- When response is returned from server, previously hidden message is now displayed and populated with a label depending on registration success or failure.

(1.1.5)
- Setup simple function to check for presence of token in browser(https://ibb.co/hP6AUQ)
- Token will be removed if user navigates to /logout route 
- Logout and Register conditionally displayed depending on login status

(1.1.4)
- Passwords being hashed before saving
- Login view added
- Password entered on login view is hashed befor ebeing compared with stored password
- Word Schema added
- Synonym Schema added
- Message relayed back to user onsuccess

(1.1.3)
- User can be registered to database

(1.1.2) 
- Added User schema and setup link to API from the client

(1.1.1) 
- Setup userServices factory.

(1.1.0) 
- Basic registration view.
- Setup Main and User controllers as well as routing.

(1.0.0) 
- Initialising app, serving basic index view

---
