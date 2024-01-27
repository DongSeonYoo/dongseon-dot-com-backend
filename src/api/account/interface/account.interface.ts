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
}
