-- Create trigger for oauth tokens
CREATE TRIGGER update_oauth_tokens
AFTER UPDATE ON oauth_tokens
FOR EACH ROW
BEGIN
  UPDATE oauth_tokens
  SET updated_at = CURRENT_TIMESTAMP
  WHERE token_id = NEW.token_id;
END;