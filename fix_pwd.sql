UPDATE doctors SET password = '$2a$10$BMNYy4Uu.1C6Wx2MSq9OpO6yKaZgTi/vW8gtBRnV1JSOU7sI/T52C' WHERE id IN (1,2,3,4,8);
SELECT id, first_name, LENGTH(password) as len, SUBSTRING(password,1,7) as prefix FROM doctors;
