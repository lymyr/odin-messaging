ALTER TABLE "User"
ADD CONSTRAINT lowercase_username 
CHECK ("id" = LOWER("id"))