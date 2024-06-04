import { Controller } from "@hotwired/stimulus";


// Connects to data-controller="message"
export default class extends Controller {
  static targets = ["xyRealTime", "randomKey", "content", "form", "submitBtn"];
  async connect() {
    this.contentTarget.disabled = true;
    this.submitBtnTarget.disabled = true;
    let result = await this.generateRandomNumber();
    this.generatedKey = this.generateRandomKey(result); // Store the generated key in an instance variable
    this.contentTarget.disabled = false;
    this.submitBtnTarget.disabled = false;
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


   encrypt(text, key) {
    let encrypted = '';
    const base = 32; // Starting ASCII printable character code
    const range = 95; // Number of printable characters (126 - 32 + 1)

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      const current = ((charCode - base + keyCode - base) % range) + base;
      encrypted += String.fromCharCode(current);
    }

    return encrypted;
  }

   decrypt(encrypted, key) {
    let decrypted = '';
    const base = 32;
    const range = 95;

    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      const current = ((charCode - base - (keyCode - base) + range) % range) + base;
      decrypted += String.fromCharCode(current);
    }

    return decrypted;
  }

  async encryptMessage(event) {
    event.preventDefault();

    const message = this.contentTarget.value;
    const finalMessage = this.encrypt(message, this.generatedKey);
    this.formTarget.classList.add("d-none")
  }
}
