import * as SecureStore from 'expo-secure-store';
import { createContext, FC, useContext, useEffect, useReducer } from 'react';

interface IUserInfo {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
}

interface IAction {
  type: string;
  payload: IUserInfo | null;
}

interface IState {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  isSignIn: boolean;
  isLoading: boolean;
}

interface IAuthContext extends IState {
  signIn: (userInfo: IUserInfo) => void;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const initialState: IState = {
  uid: '',
  first_name: '',
  last_name: '',
  email: '',
  isSignIn: false,
  isLoading: true,
};

const reducer = (prevState: IState, action: IAction): IState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        uid: (action.payload as IUserInfo).uid,
        first_name: (action.payload as IUserInfo).first_name,
        last_name: (action.payload as IUserInfo).last_name,
        email: (action.payload as IUserInfo).email,
        isSignIn: true,
        isLoading: false,
      };
    case 'SIGN_OUT':
      return {
        uid: '',
        first_name: '',
        last_name: '',
        email: '',
        isSignIn: false,
        isLoading: false,
      };
    case 'RESTORE_AUTH':
      return {
        ...prevState,
        isLoading: false,
      }
    default:
      return prevState;
  };
};

export const AuthStore: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    void checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const uid = await SecureStore.getItemAsync('uid');
      const first_name = await SecureStore.getItemAsync('first_name');
      const last_name = await SecureStore.getItemAsync('last_name');
      const email = await SecureStore.getItemAsync('email');

      console.log("User: ", uid, first_name);

      if (uid && first_name && last_name && email) {
        dispatch({
          type: 'SIGN_IN',
          payload: {
            uid,
            first_name,
            last_name,
            email,
          },
        });
      } else {
        dispatch({ type: 'RESTORE_AUTH', payload: null });
      }
    } catch (error) {
      console.error('[Auth Context] Check auth error:', error);
      await signOut();
      dispatch({ type: 'RESTORE_AUTH', payload: null });
    }
  };

  const signIn = async (userInfo: IUserInfo): Promise<void> => {
    const { uid, first_name, last_name, email } = userInfo;

    await SecureStore.setItemAsync('uid', uid ?? '');
    await SecureStore.setItemAsync('first_name', first_name ?? '');
    await SecureStore.setItemAsync('last_name', last_name ?? '');
    await SecureStore.setItemAsync('email', email ?? '');

    dispatch({
      type: 'SIGN_IN',
      payload: {
        uid,
        first_name,
        last_name,
        email,
      },
    });
  };

  const signOut = async (): Promise<void> => {
    dispatch({ type: 'SIGN_OUT', payload: null });
    
    await SecureStore.deleteItemAsync('uid');
    await SecureStore.deleteItemAsync('first_name');
    await SecureStore.deleteItemAsync('last_name');
    await SecureStore.deleteItemAsync('email');
  };

  return (
    <AuthContext.Provider
      value={{
        isSignIn: state.isSignIn,
        uid: state.uid,
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        isLoading: state.isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error("useAuthContext can only be used inside an AuthProvider");
  };

  return context;
}

export default AuthStore;