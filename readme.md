# todo: revise later

# deployment
- **frontend:** https://envelopesimple.netlify.app/
- **backend:** https://odin-messaging.onrender.com/

# backend
## notable details
- `getChat()` helper: finds chats using an array of chat participants as an argument. This can be used to verify if chat already exist between users
- `POST chats/user/:userId`: send message to user using userId. Returns chatId property which can be used to cache chatId for more efficient queries. Uses `getChat()`
- Normalized `Participants` from `Chats` to allow group chats if I ever plan to implement it. Messaging yourself is also possible.
- `ChatValidation.isParticipant` inside `validation.js` verifies if user is a participant of a chat to authorize users whether they can read or create messages within a chat. This shouldn't be needed in `chats/user/:userId` routes since chat participants are based off JWT and the userId param

# frontend
## notable details
- Chats, Profile, and UserList pages are children of App (see routes.jsx). App uses PageContainer as a wrapper which acts as a helper to display content

**todo:** add pagination in Messages and User List
