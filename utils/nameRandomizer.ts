interface NameRandomizerProps {
  name: string;
  setRandomizedName: (name: string) => void;
}

const nameRandomizer = ({ name, setRandomizedName }: NameRandomizerProps) => {
  let iterations = 0;
  let loopNumber = 0;
  const nameLength = name.length;
  const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const interval = setInterval(() => {
    let randomChars = "";
    for (let i = 0; i < nameLength - iterations; i++) {
      randomChars += charList[Math.floor(Math.random() * charList.length)];
    }
    loopNumber++;
    if (loopNumber >= 80) {
      setRandomizedName(name.slice(0, iterations) + randomChars);
      if (loopNumber % 2 === 0) iterations++;
    } else {
      setRandomizedName(randomChars);
    }
  }, 15);
  setTimeout(() => {
    clearInterval(interval);
  }, nameLength * 200);
};

export default nameRandomizer;
