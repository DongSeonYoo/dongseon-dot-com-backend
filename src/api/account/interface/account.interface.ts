export namespace IAccount {
  export interface ISignupResponse {
    userIdx: number;
  }

  export interface ISigninResponse {
    accessToken: string;
  }

  export interface IFindLoginIdResponse {
    loginId: string;
  }

  export interface IUserProfileReseponse {
    loginId: string;
    name: string;
    phoneNumber: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    profileImg: string;
  }
}
