import styled from "styled-components";
import Form from "./Form.styled";

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url(".../assets/PSSbackground.png");
  background-size: cover;
  background-position: center;
`;

const AuthPage: React.FC = () => {
    return (
        <AuthContainer>
            <Form />
        </AuthContainer>
    )
  };

  export default AuthPage;