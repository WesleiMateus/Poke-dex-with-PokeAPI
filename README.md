# Pokédex Web App

An **interactive Pokédex** developed using **vanilla JavaScript**, consuming the **PokéAPI**, with a focus on good DOM manipulation practices, asynchronous data handling, and user experience.

The project lists Pokémon from the **1st and 2nd generations (up to #251)**, allows **real-time search**, displays **types with dynamic colors via CSS variables**, and uses a **modal** for interaction.

---

## 🧠 Project Objective

This project was created for **educational purposes**, aiming to practice:

* REST API consumption
* Asynchronous programming with `fetch` and `async/await`
* Efficient DOM manipulation
* JavaScript code organization
* Use of `DocumentFragment` for better performance
* Integration between JavaScript and CSS (CSS Variables)
* User experience concepts (loading, search, modal)

---

## 🚀 Features

* 🔄 **Loading overlay while fetching data**
* 📦 **List of 251 Pokémon** (PokéAPI)
* 🖼️ **Automatic SVG/PNG image selection** (Dream World priority)
* 🧬 **Pokémon type display**
* 🎨 **Dynamic type colors using CSS Variables**
* 🔍 **Real-time search by name**
* ❌ **Clear search button**
* 🪟 **Modal displayed when clicking a Pokémon card**
* ⚡ **Optimized rendering using DocumentFragment**

---

## 🛠️ Technologies Used

* **HTML5**
* **CSS3** (with CSS Variables)
* **JavaScript (ES6+)**
* **PokéAPI** – [https://pokeapi.co](https://pokeapi.co)

---

## 📂 Project Structure

```bash
📁 pokedex-project
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## ⚙️ How the Code Works (Overview)

### 1️⃣ Initialization

The code starts after the DOM is fully loaded using:

* `DOMContentLoaded`

This ensures all HTML elements exist before being accessed or manipulated.

---

### 2️⃣ API Consumption

* The first request retrieves a basic list of Pokémon (`name` and `url`)
* For each Pokémon, a new request fetches **detailed data**
* Pokémon **types** also trigger additional requests to retrieve more information

All requests are handled with `Promise.all` to ensure proper synchronization.

---

### 3️⃣ Card Rendering

Each Pokémon card contains:

* Image
* Name
* Types (with colored badges)

Rendering is optimized using `DocumentFragment` to avoid unnecessary DOM reflows.

---

### 4️⃣ Search System

* Search happens in **real time** as the user types
* If no Pokémon matches the search, a custom message is displayed
* A clear button resets the search and restores the full list

---

### 5️⃣ Modal

* Clicking a card opens a modal
* The `body` receives a class to prevent page scrolling
* The modal can be closed via a button

---

## 🎨 Dynamic Type Colors

Type colors are controlled using **CSS Variables**, for example:

```css
--type-color-fire: #F08030;
--type-color-water: #6890F0;
```

JavaScript dynamically accesses these values using:

* `getComputedStyle(document.documentElement)`

---

## 📦 API Used

* **PokéAPI**
* Main endpoint:

```
https://pokeapi.co/api/v2/pokemon?limit=251
```

---

## ▶️ How to Run the Project

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

2. Navigate to the project folder

3. Open the `index.html` file in your browser

> No local server is required

---

## 📌 Possible Future Improvements

* Pagination or infinite scroll
* Display more details in the modal (stats, abilities)
* Filter Pokémon by type
* Favorite system
* Animations using CSS or GSAP

---

## 👨‍💻 Author

Developed by **Weslei Mateus dos Santos**

A project focused on learning and practicing modern JavaScript.

---

## 📜 License

This project is free to use for educational purposes.

Feel free to study, modify, and improve it 🚀
