import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="message"
export default class extends Controller {
  static targets = ["xyRealTime", "randomKey"];
  async connect() {
    let result = await this.generateRandomNumber();
    let generatedKey = this.generateRandomKey(result);
    console.log(generatedKey);

  }

  generateRandomNumber() {
    const randomsArray = [];
    const mouseMoveHandler = (e) => {
      this.xyRealTimeTarget.innerText = [e.clientX, e.clientY];
      if (randomsArray.length < 20) {
        randomsArray.push(e.clientX * e.clientY);
      }
    };
    window.addEventListener("mousemove", mouseMoveHandler);
    return new Promise((resolve) => {
      setTimeout(() => {
        window.removeEventListener("mousemove", mouseMoveHandler);
        this.xyRealTimeTarget.innerText = "Done!";
        this.xyRealTimeTarget.classList.remove("text-primary");
        this.xyRealTimeTarget.classList.add("text-success");
        resolve(randomsArray);
      }, 5000);
    });
  }

  generateRandomKey(result) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomKey = '';
    let generatedRandomSeed = result.flat().reduce((acc, val) => acc + val, 0);

    const random = () => {
      const x = Math.sin(generatedRandomSeed++) * 10000;
      return x - Math.floor(x);
    }

    for (let i =0; i < 10; i++) {
      const randomIndex = Math.floor(random() * characters.length);
      randomKey += characters.charAt(randomIndex);
    }
    this.randomKeyTarget.innerText = randomKey;
    this.randomKeyTarget.classList.add = 'font-weight-bold';
    return randomKey;
  }
}
