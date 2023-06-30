import LoginForm from "../components/LoginForm";
import AuthContainer from "../components/AuthContainer";

// const [currentForm, setCurrentForm] = useState<'login' | 'register'> ('login');

const Authentification = () => {
	return (
        <AuthContainer>
            <LoginForm />
        </AuthContainer>
	)
}

export default Authentification;