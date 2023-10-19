# LinkBoard

![GitHub Repo Size](https://img.shields.io/github/repo-size/hangerthem/linkboard)
![GitHub Issues](https://img.shields.io/github/issues/hangerthem/linkboard)
![GitHub Stars](https://img.shields.io/github/stars/hangerthem/linkboard)
![GitHub Forks](https://img.shields.io/github/forks/hangerthem/linkboard)

LinkBoard is a web application that allows you to create a personalized link board, similar to a bulletin board, to share your important links with others. It's a simple and customizable way to showcase your online presence.

## Features

- **Customizable**: Tailor your LinkBoard to your preferences with a variety of customization options.
- **Responsive**: LinkBoard is designed to work seamlessly on all screen sizes and devices.
- **Beautiful Design**: Enjoy an attractive and user-friendly design that enhances your online presence.
- **Easy to Use**: Setting up and managing your LinkBoard is straightforward and hassle-free.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/hangerthem/LinkBoard.git
cd LinkBoard
```

2. Install the necessary dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Visit `http://localhost:3000` in your web browser to see your LinkBoard in action.

## Usage

1. Customize your LinkBoard by editing the configuration file `config.ts` to include your name, description, and social links.

2. Customize the visual theme by modifying the `variables.css` file with your preferred color scheme, and setting the `theme` variable in the `config.ts` file to the name of your theme.

3. There are also some animations that can be enabled or disabled in the `config.ts` file.

4. Add your profile picture by replacing the existing image at `/public/profile.png`.

5. Add background image by replacing the existing image at `/public/background.webp`.

6. Add links to your LinkBoard in the `config.ts` file. You can include the name, URL, and an optional icon.

7. Customize the project's metadata in the `layout.tsx` file, including the title and description.

## Contributing

I welcome contributions from the community. If you'd like to contribute to this project, please follow my [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Frank Borisjuk**
  - Email: [f.borisjuk@hangerthem.com](mailto:f.borisjuk@hangerthem.com)

Feel free to reach out if you have any questions, suggestions, or need assistance.

_Happy LinkBoarding!_
