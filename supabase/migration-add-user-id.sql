BEGIN;

-- 1. Add the column as nullable so existing rows can be populated.
ALTER TABLE threads ADD COLUMN user_id uuid;

-- 2. Assign existing threads to the first registered user.
UPDATE threads
SET user_id = (
  SELECT id
  FROM auth.users
  ORDER BY created_at
  LIMIT 1
);

-- 3. Require every thread to have an owner.
ALTER TABLE threads ALTER COLUMN user_id SET NOT NULL;

-- 4. Keep thread ownership consistent with Supabase Auth users.
ALTER TABLE threads
  ADD CONSTRAINT threads_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- 5. Speed up queries filtering threads by user_id.
CREATE INDEX threads_user_id_idx ON threads(user_id);

COMMIT;