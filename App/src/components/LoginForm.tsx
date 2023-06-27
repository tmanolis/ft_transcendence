import Button from "./styles/Button.styled"
import { StyledForm } from "./styles/Form.styled"
import Input from "./styles/Input.styled"
import Link from "./styles/Link.styled"

export default function LoginForm() {
	return (
		<StyledForm>
			<h1>Connect</h1>
			<Button>Sign up with 42</Button>
			<p>―――――&nbsp;&nbsp;OR&nbsp;&nbsp;――――― </p>
			<Input placeholder="email"/>
			<Input placeholder="password"/>
			<Link>Don't have an account? Sign up here.&nbsp;&nbsp;</Link>
			<Button>Log In</Button>
		</StyledForm>
	)
}