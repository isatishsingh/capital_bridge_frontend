
export const validateForm = (form) => {
  console.log("phone number",form.phoneNumber);
  if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
    return 'Invalid phone number';
  }

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber)) {
    return 'Invalid PAN format';
  }

  if (form.aadhaarNumber && !/^\d{12}$/.test(form.aadhaarNumber)) {
    return 'Invalid Aadhaar number';
  }

  if (
    form.gstNumber &&
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstNumber)
  ) {
    return 'Invalid GST number';
  }

  if (form.passportNumber && !/^[A-Z][0-9]{7}$/.test(form.passportNumber)) {
    return 'Invalid passport number';
  }

  return null;
};