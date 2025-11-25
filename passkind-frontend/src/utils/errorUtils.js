export const getFriendlyErrorMessage = (err) => {
  const rawMessage =
    err.response?.data?.message ||
    err.message ||
    "An unexpected error occurred";

  // Check for common SQL/Backend errors
  // Check for common SQL/Backend errors
  if (rawMessage.includes("duplicate key value")) {
    // Check for specific constraint violations using more precise patterns
    // Postgres error format: Key (column)=(value) already exists
    // OR constraint name: users_username_key
    if (
      rawMessage.includes("Key (username)") ||
      rawMessage.includes("users_username_key") ||
      rawMessage.includes("uk_users_username")
    )
      return "This username is already taken. Please choose another.";

    if (
      rawMessage.includes("Key (email)") ||
      rawMessage.includes("users_email_key") ||
      rawMessage.includes("uk_users_email")
    )
      return "This email address is already registered.";

    return "This value is already in use.";
  }

  if (rawMessage.includes("could not execute statement")) {
    return "Unable to save changes. Please check your input and try again.";
  }

  if (rawMessage.includes("Bad credentials")) {
    return "Invalid username or password.";
  }

  // If message is too long (likely a stack trace or raw error), show generic
  if (rawMessage.length > 100) {
    return "An unexpected system error occurred. Please try again later.";
  }

  return rawMessage;
};
