# Knight Queen Puzzle

This project is a web-based puzzle game that challenges players to place knights and queens on a chessboard according to specific rules. The objective is to solve various puzzles by strategically positioning these pieces.

## Features

- **Interactive Chessboard**: Allows users to place and move knights and queens on the board.
- **Puzzle Descriptions**: Provides detailed explanations for each puzzle scenario.
- **User-Friendly Interface**: Designed for intuitive navigation and gameplay.
- **Tailwind CSS Styling**: Utilizes Tailwind CSS for responsive and modern design elements.

## Getting Started

### Prerequisites

- Basic understanding of chess mechanics.
- Node.js and npm installed on your local machine.

### Cloning the Repository

To clone the repository, run the following command:

```bash
git clone https://github.com/shay-ff/knight-queen-puzzle.git
```

### Installation

Navigate to the project directory and install the necessary dependencies:

```bash
cd knight-queen-puzzle
npm install
```

### Building the Project

The project uses Tailwind CSS for styling. To build the project locally, follow these steps:

1. **Ensure Tailwind CSS is Installed**  
   Verify that Tailwind CSS is listed in your `package.json` file. If it's not present, install it using npm:

   ```bash
   npm install tailwindcss
   ```

2. **Configure Tailwind**  
   Ensure that the `tailwind.config.js` file is properly set up in the root directory.

3. **Set Up PostCSS**  
   Ensure that `postcss.config.js` is present in the root directory with the following content:

   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. **Create the CSS File**  
   In your CSS file (e.g., `index.css`), include the following directives:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **Build the CSS**  
   Use the following command to process your CSS with Tailwind and generate the final styles:

   ```bash
   npx tailwindcss -i ./index.css -o ./output.css --watch
   ```

   The `--watch` flag allows Tailwind to rebuild your CSS whenever you make changes.

6. **Link the Generated CSS**  
   Ensure that your `index.html` file links to the generated `output.css` file:

   ```html
   <link href="output.css" rel="stylesheet">
   ```

7. **Run the Application**  
   You can use a simple HTTP server to serve your application locally. If you have Python installed, you can run:

   ```bash
   python -m http.server
   ```

   Then, navigate to `http://localhost:8000` in your browser to view the application.

For more details, visit the [GitHub repository](https://github.com/shay-ff/knight-queen-puzzle).
