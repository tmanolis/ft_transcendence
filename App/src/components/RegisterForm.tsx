import Button from "./styles/Button.styled"
import Form from "./styles/Form.styled"
import Input from "./styles/Input.styled"
import HoverText from "./styles/HoverText.styled"


export default function RegisterForm() {
	return (
		<Form>
			<h1>Sign Up</h1>
			<Input placeholder="username" />
			<Input placeholder="email" />
			<Input placeholder="password" />
			<HoverText>⍰ requirements</HoverText>
			<Button>Create an account</Button>
		</Form>
	)
}
