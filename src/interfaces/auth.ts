export interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface SigninRequestBody {
  email: string;
  password: string;
}

export interface refreshTokenRequestBody {
  refresh_token: string;
}

export interface BaseResponse {
  message: string;
}

// also used with the /refresh-token endpoint
export interface SigninResponse extends BaseResponse {
  access_token: string;
  refresh_token: string;
}
