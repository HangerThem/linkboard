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

2. Customize the visual theme by modifying the `theme.ts` file. You can change the colors and fonts to suit your preferences. After that change the `theme` property in the `config.ts` file to your theme name.

3. Add your profile picture by replacing the existing image at `/public/profile.png`.

4. Add background image by replacing the existing image at `/public/background.webp`.

5. Add links to your LinkBoard in the `config.ts` file. You can include the name, URL, and an optional icon.

6. Customize the app's title in the `config.ts` file.

7. Deploy your LinkBoard to a hosting service of your choice.

Additionally, there are some animations you can toggle in the `config.ts` file, also you can choose to sort the links by their lenght to make the board look more organized.

## Contributing

I welcome contributions from the community. If you'd like to contribute to this project, please follow my [Contribution Guidelines](CONTRIBUTING).

## License

This project is licensed under the AGPLv3 License. For more information, please refer to the [LICENSE](LICENSE) file.

## Contact

- **Frank Borisjuk**
  - Email: [f.borisjuk@hangerthem.com](mailto:f.borisjuk@hangerthem.com)

Feel free to reach out if you have any questions, suggestions, or need assistance.

_Happy LinkBoarding!_
