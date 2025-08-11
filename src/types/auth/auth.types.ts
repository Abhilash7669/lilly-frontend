/* 
    Login type
*/ 
export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    userId: string;
    avatar: string;
    userName: string;
  };
};

export type LoginFormData = {
  email: string;
  password: string;
};

/* 
    Signup Type
*/
export type SignUpResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      userId: string;
      userName: string;
    };
  };
};

export type SignUpFormData = {
  userName: string;
  password: string;
  email: string;
};

/* 
    OAuth Type
*/
export type OAuthResponse = {
  message: string;
  success: boolean;
  title: string;
  data: {
    googleAuthUrl: string;
  };
};

