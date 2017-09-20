# Web app acting as a thesaurus, allowing users to search for words, as well as add their own.

#### README file 1.2.2


To run:

1) Go to root and 
`node app.js`

Requirements:

- NodeJs and MongoDb are required to be installed locally on your machine

---

Bugs:
- When forms are successfully submited, their values are cleared. This is not the case with passwords on the register view, not sure why it's happening. (From 1.2.0, fixed in 1.2.2)
- Hamburger menu won't collapse on toggle. Puzzled as to why this is happening.

---

Added in previous commits::

(1.2.2)
- Messages resized depending on screen(device) width
- Fixed bug where passwords weren't clearing on successful register response.
- Swapped $push with $addToSet inour Update() function in the /api/addSynonym route, preventing duplicate synonyms on our Word object's nested synonyms property.
- Some slight styling and colouring

(1.2.0)
- Forms cleared on successful login, register and thesaurus submit.
- Now checking that no synonym value is an empty String, as a user may try to intentionally abuse system, rather than accidentally which is what we previously had in mind with checking last synonym value only.
- Updated views so that any displayed error messages become hidden if the form values are changed and the submit returns a success message.

(1.1.9)
- Changed synonym separator from colon(:) to comma(,) to make entry keyboard-friendly on mobile device.
- The baseWord input's onchange(ng-change) is setup to query the database with each keypress.
	If a match is found, a conditionally-displayed <p> element displays the returned synonyms.
- Checking that final synonym(word after last comma in synonym input) isn't an empty String, and removing if so.
- Success/Error message relayed to user after http POST on thesaurus, register and login view.


(1.1.8)
- User redirected after successful login
- Words can be added, synonyms effectively added
- Added separator (colon :) to allow multiple consecutive synonym additions

(1.1.7)
- Thesaurus controller and factory setup
- Thesaurus view setup with extensive validation carried out client-side

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
