import styled from "styled-components";
import JBRegular from '../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2'

const PageContainer = styled.div`
  @font-face {
		font-family: 'JetBrains Mono';
    src: url(${JBRegular}) format('woff2');
    font-weight: normal;
    font-style: normal;
	}
	
	h1, p {
		color: white;
		font-family: 'JetBrains Mono', monospace;
  }
	
	background: black;
	align-items: center;
	text-align: center;
	justify-content: center;
	flex-direction: column;
	position: fixed;
	width: 100%;
`

const Pong = () => {
	return (
		<>
		<PageContainer>
			<h1>Pong</h1>
			<canvas></canvas>
			<p>Move your mouse to start playing</p>
		</PageContainer>
		</>
	)
}

export default Pong;
