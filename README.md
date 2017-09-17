# Web app acting as a thesaurus, allowing users to search for words, as well as add their own.

#### README file 1.1.5


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
