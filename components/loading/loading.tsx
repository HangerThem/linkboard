// Loading for the whole page
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

const Spinner = styled.div`
	border: 8px solid rgba(var(--color-title), 0.1);
	border-top: 8px solid rgba(var(--color-title), 0.5);
	border-radius: 50%;
	width: 50px;
	height: 50px;
	animation: spin 1s linear infinite;
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

export default function Loading() {
	return (
		<Container>
			<Spinner />
		</Container>
	);
}