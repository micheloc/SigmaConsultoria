import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome6';

import iUserPass from 'types/interfaces/iUserPass';

import { API_URL } from '@env';
import { Text } from 'react-native';
import {
  Container,
  BackgroundImg,
  ViewFormLogin,
  BoxFormLogin,
  Input,
  ButtonConf,
  ContainerIconLogin,
} from 'styles/boody.containers';

import { useContext, useState } from 'react';
import iLogin from 'types/interfaces/iLogin';
import { _access, _user, _userLoggout } from 'services/login_service';
import AuthContext from 'context_provider/index';

const ax = axios.create({ baseURL: API_URL });

const Login = () => {
  const { check } = useContext(AuthContext);

  const [user, setUser] = useState<iUserPass>({
    userName: '',
    password: '',
  });

  const _login = async () => {
    await _userLoggout();

    try {
      const response = await ax.post(
        '/Account/login',
        { userName: user.userName, password: user.password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const access: any = response.data;

      // Aqui será carregados os dados do usuário que está logado e validado.
      const obj: iLogin = {
        id: null,
        token: access.token,
        usuario: access.nomeUsusuario,
        expire: access.expiration,
      };
      await _access(obj);

      await check();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <BackgroundImg source={require('../../assets/img/login.jpg')} />

      <ContainerIconLogin>
        <Icon name="user-large" size={110} color="rgba(44, 46, 17, 0.5)" />
      </ContainerIconLogin>

      <ViewFormLogin>
        <BoxFormLogin>
          <Input
            placeholder="E-mail"
            textAlign="center"
            value={user.userName}
            onChangeText={(txt: string) => setUser((prevState: any) => ({ ...prevState, userName: txt }))}
          />

          <Input
            placeholder="Senha"
            textAlign="center"
            secureTextEntry={true}
            value={user.password}
            onChangeText={(txt: string) => setUser((prevState: any) => ({ ...prevState, password: txt }))}
          />

          <ButtonConf onPress={_login}>
            <Text style={{ color: 'white', fontSize: 16 }}>Entrar</Text>
          </ButtonConf>
        </BoxFormLogin>
      </ViewFormLogin>
    </Container>
  );
};

export default Login;
