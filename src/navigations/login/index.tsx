import { Text } from 'react-native';
import {
  Container,
  BackgroundImg,
  ViewFormLogin,
  BoxFormLogin,
  Input,
  ButtonConf,
} from 'styles/boody.containers';

import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  return (
    <Container>
      <BackgroundImg source={require('../../assets/img/login.jpg')} />
      <Icon name="user-large" size={30} color="#900" />
      <ViewFormLogin>
        <BoxFormLogin>
          <Input placeholder="E-mail" textAlign="center" />
          <Input placeholder="Senha" textAlign="center" secureTextEntry={true} />
          <ButtonConf>
            <Text style={{ color: 'white' }}>Entrar</Text>
          </ButtonConf>
        </BoxFormLogin>
      </ViewFormLogin>
    </Container>
  );
};

export default Login;
