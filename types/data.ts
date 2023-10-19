interface Data {
  theme?: string;
  name: string;
  description: string;
  profilePicture: string;
  animation?: {
    nameRandomizer: boolean;
  };
  links: {
    name: string;
    url: string;
    icon?: any;
  }[];
}
