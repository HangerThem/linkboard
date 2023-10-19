import Theme from "./theme";

interface Data {
  theme?: Theme;
  name: string;
  description: string;
  profilePicture: string;
  links: {
    name: string;
    url: string;
    icon: any;
  }[];
}

export default Data;
