export function getAuthErrorMessage(err) {
  const msg = err?.response?.data?.message;
  const errors = err?.response?.data?.errors;
  const status = err?.response?.status;

  if (errors?.length) return errors.map((e) => e.message).join('. ');
  if (msg) return msg;

  if (status === 403) return 'Account inactive. Contact your administrator.';
  if (status === 401) return 'Invalid email or password';
  if (!err?.response) return 'Network error. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

export function getApiErrorMessage(err, fallback = 'Request failed') {
  const msg = err?.response?.data?.message;
  const errors = err?.response?.data?.errors;
  if (errors?.length) return errors.map((e) => e.message).join('. ');
  if (msg) return msg;
  if (!err?.response) return 'Network error. Please check your connection.';
  return fallback;
}
