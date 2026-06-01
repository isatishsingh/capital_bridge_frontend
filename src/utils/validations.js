export const validateForm = (form) => {
  // console.log("phone number", form.phoneNumber);

  if (form.name && !/^[A-Za-z\s]{2,50}$/.test(form.name)) {
    return 'Invalid name format';
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return 'Invalid email address';
  }

  if (form.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password)) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
  }

  if (form.phoneNumber && !/^[6-9]\d{9}$/.test(form.phoneNumber)) {
    return 'Invalid phone number';
  }

  if (form.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber)) {
    return 'Invalid PAN format';
  }

  if (form.aadhaarNumber && !/^\d{12}$/.test(form.aadhaarNumber)) {
    return 'Invalid Aadhaar number';
  }

  const gst = form.gstNumber?.trim();
  if (
    gst &&
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gst)
  ) {
    return 'Invalid GST number';
  }

  const passport = form.passportNumber?.trim();
  if (passport && !/^[A-Z][0-9]{7}$/i.test(passport)) {
    return 'Invalid passport number';
  }

  return null;
};