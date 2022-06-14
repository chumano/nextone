export interface UpdateProfileDTO {
  name: string;
  phone: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
