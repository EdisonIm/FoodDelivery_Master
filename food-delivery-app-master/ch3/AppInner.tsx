import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import Settings from './src/pages/Settings';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import {Alert} from 'react-native';
import userSlice from './src/slices/user';
import {useAppDispatch} from './src/store';
import Config from 'react-native-config';
import orderSlice from './src/slices/order';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  console.log('isLoggedIn', isLoggedIn);

  const [socket, disconnect] = useSocket();

  //토큰 있는지 체크하는 로직, 실제로는 보안상의 이유로 여기 넣으면 안됨
  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (accessToken) {
          console.log('Access Token Found!:', accessToken);
        } else {
          console.log('No accessToken found T_T');
        }
        if (refreshToken) {
          console.log('Refresh Token Found!:', refreshToken);
        } else {
          console.log('No refreshToken found T_T');
        }
      } catch (error) {
        console.error('Error reading tokens from storage:', error);
      }
    };
    checkToken();
  }, []);

  const saveAndCheckToken = async (tokenName: string, tokenValue: string) => {
    try {
      await EncryptedStorage.setItem(tokenName, tokenValue);
      const savedToken = await EncryptedStorage.getItem(tokenName);
      if (savedToken) {
        console.log(`${tokenName} 저장 및 조회 성공:`, savedToken);
      } else {
        console.log(`${tokenName} 저장 실패 또는 조회 실패`);
      }
    } catch (error) {
      console.error(`${tokenName} 저장 또는 조회 중 오류 발생:`, error);
    }
  };
  // 사용 예
  saveAndCheckToken('accessToken', '여기에_액세스_토큰_있다!!');
  saveAndCheckToken('refreshToken', '여기에_리프레시_토큰_있다!!');

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        // refreshToken을 조회합니다.
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('No refreshToken stored T_T');
          // refreshToken이 없으면 초기 로그인 화면으로 이동할 수 있습니다.
          // navigation.navigate('SignIn');
          return;
        }

        // refreshToken이 있으면 서버에 토큰 갱신을 요청합니다.
        const response = await axios.post(
          `${Config.API_URL_PAPAYATEST}/refreshToken`,
          {},
          {headers: {authorization: `Bearer ${refreshToken}`}},
        );

        // 새로운 accessToken과 refreshToken을 받아와서 저장합니다.
        await EncryptedStorage.setItem(
          'accessToken',
          response.data.data.accessToken,
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.data.refreshToken,
        );
        // 사용자 상태 업데이트
        dispatch(
          userSlice.actions.setUser({
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );

        console.log('Token refreshed');
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      }
    };

    getTokenAndRefresh();
  }, [dispatch]);

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          // 토큰 만료를 나타내는 상태 코드
          const refreshToken = await EncryptedStorage.getItem('refreshToken'); // refreshToken을 가져옵니다.
          if (refreshToken) {
            // refreshToken을 사용하여 새 accessToken을 요청합니다.
            const refreshResponse = await axios.post(
              `${Config.API_URL_PAPAYATEST}/refreshToken`,
              {},
              {
                headers: {authorization: `Bearer ${refreshToken}`},
              },
            );
            const newAccessToken = refreshResponse.data.data.accessToken;

            // 새로운 accessToken을 저장합니다.
            await EncryptedStorage.setItem('accessToken', newAccessToken);

            // 실패한 요청에 새 accessToken을 설정하고 재요청합니다.
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(config);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{title: '오더 목록'}}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{title: '내 오더'}}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
