# user-access-management-system
It is a User Access Management System App created using Node.js.

**Steps to run project:**
1. Create local database in mongodb.
2. Change MONGODB_URL in **dev.env** file.
3. Create initial record for admin by copying following 
```{
  "name": "Admin",
  "email": "example@email.com",
  "role": "admin",
  "password": "$2a$08$9T.sThmX61ScBrafGbtqTOj06msgIOGGdsOLriqwr0ThFSSvNps0C",
  "tokens": [],
}
```
4. In terminal run command `npm run dev`.
5. Open browser and enter URL as `localhost:3000/user`
    - Enter Email as `example1@email.com`.
    - Enter Password as `Example@123`
