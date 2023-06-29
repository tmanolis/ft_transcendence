import Button from "./styles/Button.styled"
import Link from "./styles/Link.styled"
import Form from "./styles/Form.styled"
import Input from "./styles/Input.styled"

export default function SignupForm() {
	return (
		<Form>
			<h1>Sign Up</h1>
			<Input placeholder="username" />
			<Input placeholder="email" />
			<Input placeholder="password" />
			<Link>requirements</Link>
			<Button>Create an account</Button>
		</Form>
	)
}
