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
} from "@/components/linkBoard/linkBoardStyles";
import { useEffect, useState } from "react";
import ShareBar from "@/components/sharebar/sharebar";
import nameRandomizer from "@/utils/nameRandomizer";
import Loading from "@/components/loading/loading";
import Source from "@/components/source/source";

export default function LinkBoard() {
  const [loading, setLoading] = useState(true);
  const [randomizedName, setRandomizedName] = useState(data.name);

  useEffect(() => {
    setLoading(false);
    if (data.animation && data.animation?.nameRandomizer) {
      nameRandomizer({ name: data.name, setRandomizedName });
    }
    if (data.sortByLength) {
      data.links.sort((a, b) => (a.name.length > b.name.length ? 1 : -1));
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <Container>
      <ShareBar />
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
      <LinksContainer $linksNumber={data.links.length}>
        {data.links.map((link, index) => (
          <LinkContainer key={link.url} $delay={index * 100}>
            <Link href={link.url}>
              {link.icon && <link.icon />}
              {link.name}
            </Link>
          </LinkContainer>
        ))}
      </LinksContainer>
      <Source />
    </Container>
  );
}
