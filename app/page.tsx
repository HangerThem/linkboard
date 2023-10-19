"use client";

import data from "@/config";
import Link from "next/link";
import {
  HeaderContainer,
  InfoContainer,
  ProfilePicture,
  Name,
  Description,
  LinksContainer,
  LinkContainer,
  Container,
} from "@/styles/linkBoardStyles";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  data.links.sort((a, b) => (a.name.length > b.name.length ? 1 : -1));
  document.documentElement.setAttribute("theme", data.theme || "dark");

  return (
    <Container>
      <HeaderContainer>
        <ProfilePicture
          src={data.profilePicture}
          alt="Profile"
          width={200}
          height={200}
        />
        <InfoContainer>
          <Name>{data.name}</Name>
          <Description>{data.description}</Description>
        </InfoContainer>
      </HeaderContainer>
      <LinksContainer linksnumber={data.links.length}>
        {data.links.map((link, index) => (
          <LinkContainer key={link.url} delay={index * 100}>
            <Link href={link.url}>
              {link.icon && <link.icon />}
              {link.name}
            </Link>
          </LinkContainer>
        ))}
      </LinksContainer>
    </Container>
  );
}
