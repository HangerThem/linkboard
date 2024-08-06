import styled, { keyframes } from "styled-components";

interface ShareLinksContainerProps {
	open: boolean;
}

const slideIn = keyframes`
	from {
		transform: translateX(100%);
		width: 0;
		padding-inline: 0;
	}
	to {
		transform: translateX(0);
		width: 100px;
		padding-inline: 1rem .5rem;
	}
`;

const slideOut = keyframes`
	from {
		transform: translateX(0);
		width: 100px;
		padding-inline: 1rem .5rem;
	}
	to {
		transform: translateX(100%);
		width: 0;
		padding-inline: 0;
	}
`;

export const ShareBarContainer = styled.button`
	display: flex;
	justify-content: flex-end;
	flex-direction: row;
	background-color: rgba(var(--color-background), 0.5);
	border: 1px solid rgba(var(--color-border), 0.5);
	border-radius: 20px;
	align-items: center;
	color: rgba(var(--color-title));
	position: absolute;
	padding: 0;
	margin: 0;
	top: 15px;
	right: 15px;
	z-index: 1;
	font-size: 1.5rem;
	overflow: hidden;

	&:hover {
		background-color: rgba(var(--color-background), 0.7);
	}
`;

export const ShareLinksContainer = styled.div<ShareLinksContainerProps>`
	border: none;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 1rem;
	height: 40px;
	transform: translateX(100%);
	width: 0;
	padding-inline: 0;
	animation: ${(props) => (props.open ? slideIn : slideOut)} 0.5s ease-out
		forwards;

	> * {
		cursor: pointer;
	}
`;

export const ShareDialog = styled.dialog`
	border: none;
	padding: 0;

	&::backdrop {
		background-color: rgba(var(--color-background), 0.8);
		backdrop-filter: blur(5px);
	}
`;

export const ShareTrigger = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	z-index: 1;
	background-color: rgb(var(--color-background));
`;
