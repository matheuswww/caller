CREATE TABLE IF NOT EXISTS notification (
  id         VARCHAR(36) PRIMARY KEY,
  user_id    VARCHAR(36),
  subject    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);