export class ViewDetailProfileResponseDto {
  loginId: string;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  profileImg: string;
}