export class ViewDetailProfileResponseDto {
  loginId: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  profileImg: string;
}
