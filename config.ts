import {
  Twitter,
  Github,
  Linkedin,
  EnvelopeFill,
  Telegram,
  Instagram,
  Messenger,
  Spotify,
  Discord,
} from "react-bootstrap-icons";

const data: Data = {
  theme: "default",
  animation: {
    nameRandomizer: false,
  },
  name: "Frank Borisjuk",
  description: "Software Engineer",
  profilePicture: "/profile.png",
  links: [
    {
      name: "Twitter",
      url: "https://twitter.com/hangerthem",
      icon: Twitter,
    },
    {
      name: "GitHub",
      url: "https://github.com/hangerthem",
      icon: Github,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/franti%C5%A1ek-borisjuk-022686225/",
      icon: Linkedin,
    },
    {
      name: "Email",
      url: "mailto:f.borisjuk@hangerthem.com",
      icon: EnvelopeFill,
    },
    {
      name: "Telegram",
      url: "https://t.me/hangerthem",
      icon: Telegram,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/ferda_borisjuk/",
      icon: Instagram,
    },
    {
      name: "Messenger",
      url: "https://m.me/frant.borisjukovic",
      icon: Messenger,
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/user/jiguc8apyguwslzwptmx0e4zn",
      icon: Spotify,
    },
    {
      name: "Discord",
      url: "https://discord.com/users/495134242825699328",
      icon: Discord,
    },
  ],
};

export default data;
