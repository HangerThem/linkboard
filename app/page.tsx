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
  const nameLength = data.name.length;
  const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [randomizedName, setRandomizedName] = useState(data.name);

  useEffect(() => {
    setLoading(false);
    if (data.animation && data.animation?.nameRandomizer) nameRandomizer();
  }, []);

  const nameRandomizer = () => {
    let iterations = 0;
    let loopNumber = 0;
    const interval = setInterval(() => {
      let randomChars = "";
      for (let i = 0; i < nameLength - iterations; i++) {
        randomChars += charList[Math.floor(Math.random() * charList.length)];
      }
      loopNumber++;
      if (loopNumber >= 80) {
        setRandomizedName(data.name.slice(0, iterations) + randomChars);
        if (loopNumber % 2 === 0) iterations++;
      } else {
        setRandomizedName(randomChars);
      }
    }, 15);
    setTimeout(() => {
      clearInterval(interval);
    }, nameLength * 200);
  };

  if (loading) {
    return null;
  }

  data.links.sort((a, b) => (a.name.length > b.name.length ? 1 : -1));
  document.documentElement.setAttribute("theme", data.theme || "dark");

  return (
    <Container>
      <HeaderContainer>
        <ProfilePicture
          src="/profile.png"
          alt="Profile"
          width={150}
          height={150}
        />
        <InfoContainer>
          <Name>{randomizedName}</Name>
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
