UPDATE doctors SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkgv/y' WHERE id IN (1,2,3,4,8);
SELECT id, first_name, LEFT(password,7) as bcrypt_prefix FROM doctors;
