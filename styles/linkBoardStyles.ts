import styled, { css, keyframes } from "styled-components";
import Image from "next/image";

interface LinkContainerProps {
  delay: number;
}

interface LinksContainerProps {
  linksnumber: number;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const flexCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const fontFamily = "var(--font-family)";

export const Container = styled.div`
  ${flexCenter}
  gap: 2rem;
  height: 100vh;
`;

export const HeaderContainer = styled.div`
  ${flexCenter}
  gap: 1rem;
`;

export const InfoContainer = styled.div`
  ${flexCenter}
  opacity: 0;
  color: rgba(var(--color-title));
  transform: scale(0.8);
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: 500ms;
`;

export const ProfilePicture = styled(Image)`
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  background-color: rgba(var(--color-image));
  border: 5px solid rgba(var(--color-image));
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
`;

export const Name = styled.h1`
  font-size: 2.5rem;
  line-height: 2.5rem;
  font-family: ${fontFamily};
  font-weight: bold;
  position: relative;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.25rem;
  font-family: ${fontFamily};
  font-weight: normal;
  margin: 0;

  &::before,
  &::after {
    content: "-";
    margin: 0 0.5rem;
  }
`;

export const LinksContainer = styled.div<LinksContainerProps>`
  ${flexCenter}
  gap: 15px;
  height: 0;
  animation: scaleUp 0.5s ease-out forwards;
  animation-delay: 1000ms;

  @keyframes scaleUp {
    from {
      height: 0;
    }
    to {
      height: ${(props) => props.linksnumber * 65 - 15}px;
    }
  }
`;

export const LinkContainer = styled.div<LinkContainerProps>`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease-in-out;
  width: 350px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(var(--color-background), 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--color-background), 0.5);
  text-align: center;
  font-family: ${fontFamily};
  animation: scaleIn 1s ease-out forwards;
  transform: scaleX(0);
  animation-delay: ${(props) => props.delay + 1000}ms;

  a {
    gap: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(var(--color-text), 0.8);
    text-decoration: none;
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
    animation-delay: ${(props) => props.delay + 1250}ms;
  }

  @keyframes scaleIn {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
`;
