# Scrapper PDF

### Installation

Use [pip](https://pip.pypa.io/en/stable/) to install.

```bash
pip install opencv-python
pip install pdf2image
pip install easyocr

# If you receive an error when running the script, try downgrading the PIL and matplotlib
pip install --ignore-installed Pillow==9.3.0
pip install matplotlib==3.7.1

```

## Project Instalation

This project is a Monorepo built using TurboRepo. The **/api** has an NestJS project and the **/client** an Vite project using React + typescript.

Install with **npm**

```bash
  npm install

  # Docker compose
  npm run start:services

  # Dev Mode
  npm run dev
```

## Testing
