INSERT INTO users (id, name, email, password_hash, role, avatar_url, updated_at)
VALUES (
  'e35bb631-4d8c-4369-af73-f64987ef8430',
  'Admin User',
  'admin@lms.com',
  '$2b$10$M5FfkP7sKeiKYSQqmw7/7.ycod6MbqJ4uja9cpxNIIqWlu.up3uN.',
  'ADMIN'::"Role",
  'https://github.com/shadcn.png',
  NOW()
)
ON CONFLICT (email) DO NOTHING;
