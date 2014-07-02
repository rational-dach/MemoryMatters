## Design document

### Considerations

MemoryMatters is a simple memory matching game which can be played online with a
browser. The application needs to be responsive and is required to display information
on events, i.e. the one player has completed a move the other player needs to be
presented this information without having the user push a button.

-> Use of AJAX (asynchronous Javascript and XML)
We decided to use jQuery because this library is very common and widely used.

Technology focus.
For the server side we have chose to use Node.js, Express, and MongDB because those
frameworks have gained popularity and were made available on Bluemix.

### Basic Structure

The application is comprised of the following components
 
#### The main modules
memory.js in the root folder is the main module which gets instantiated by node
 
#### Client application running in browser
The code for the client side part can be found in the public folder: the main
index.html and additional pages in folder "pages". In general a page in comprised
of html, css tags, and Javascript. We tried to keep those parts in separate files.
 
#### Interfaces
The client application communicates with the server through a JSON interface which is
accessed by http methods GET, PUT, and DELETE. THe interfaces to the various modules
can be be found in the "routes" folder. Each module defines a set of URLs which present
different functions.
 
Examples:
 
<base url>/user/create				create a user
<base url>/user/login				user login
<base url>/game/reqgame				request a new game
<base url>/game/querygame			query the status of a game
 
#### Server code
Various modules like database access and player logic can be found there
 
 
### Behavior
 
Before a user can sing in, he/she has to register first. The server creates a session
for every logged-in user. The session is valid as long the browser is not closed.
If a users wants to play a game, she/he can request a new game via the menu. The server
pushes requests to an array first. In regular intervals of a few seconds it iterates
through the array of requests and tries to turn a request into a game. This is instant for
the request of a computer player but may take some time if a human player was requested.
If a request or game idles for more than 5 minutes it is removed.
 