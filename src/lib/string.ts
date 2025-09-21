export const capitalizeAndRemoveUnderscore = (str: string) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export const maskPhoneNumber = (phoneNumber: string): string => {
  if (typeof phoneNumber !== "string" || phoneNumber.length < 4) {
    return phoneNumber;
  }

  const lastFourDigits = phoneNumber.slice(-4);
  const maskedPart = phoneNumber.slice(0, -4).replace(/./g, "*");
  return maskedPart + lastFourDigits;
};

export const maskEmail = (email: string): string => {
  if (typeof email !== "string" || email.length < 4) {
    return email;
  }

  const [localPart, domainPart] = email.split("@");
  const maskedLocalPart = localPart.slice(0, -2).replace(/./g, "*");
  return maskedLocalPart + "@" + domainPart;
};

export const thousandSeparator = (value: number) => {
  return value.toLocaleString("id-ID");
};
