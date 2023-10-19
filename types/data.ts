interface Data {
  theme?: string;
  name: string;
  description: string;
  profilePicture: string;
  links: {
    name: string;
    url: string;
    icon?: any;
  }[];
}