import {
  Globe,
  Github,
  Linkedin,
  EnvelopeFill,
  Instagram,
} from 'react-bootstrap-icons';

const data: Data = {
  title: "Jacob's Linkboard",
  theme: 'default',
  animation: {
    nameRandomizer: true,
  },
  name: 'Jacob Kreindler',
  description: 'Photographer // Developer',
  links: [
    {
      name: 'Website',
      url: 'https://jacob.kreindler.ca',
      icon: Globe,
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/cameracob',
      icon: Instagram,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/orbitally',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jacobkreindler/',
      icon: Linkedin,
    },
    {
      name: 'Email',
      url: 'mailto:hello@kreindler.ca',
      icon: EnvelopeFill,
    },
  ],
  sortByLength: false,
};

export default data;
