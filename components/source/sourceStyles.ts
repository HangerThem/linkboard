import styled from "styled-components";
import Link from "next/link";

export const SourceContainer = styled(Link)`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1rem;
  color: rgba(${({ theme }) => theme.colors.title}, 0.5);
  text-decoration: none;
  transition: 0.3s;
  z-index: 999;

  &:hover {
    color: rgba(${({ theme }) => theme.colors.title}, 0.8);
  }
`;
