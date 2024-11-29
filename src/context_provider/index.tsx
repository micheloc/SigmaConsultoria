import { createContext, useContext } from 'react';

import { useAccount } from './hooks/access';
import { useCultura } from './hooks/cultura';

type AuthContextData = {
  isLogged: boolean;
  check(): Promise<void>;
  lAllCultura(): Promise<void>;
  userLogout(): Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const ContextProvider = ({ children }: any) => {
  const { check, userLogout, isLogged } = useAccount();
  const { lAllCultura } = useCultura();

  const providers: any = {
    check,
    lAllCultura,
    userLogout,
    isLogged,
  };

  return <AuthContext.Provider value={providers}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
