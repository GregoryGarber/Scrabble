# COMPSCI 326 Web Programming

## Homework 07 Fetch and Multiplayer

- *This is an individual assignment.*
- **Due April 4, 2022, 11:59 PM EDT**

## Overview

This is the seventh part of a series of assignments around the game of Scrabble. We hope that it will be a fun experience in progressively learning all pieces of modern web development, so as to engineer a fully functional game. In this assignment, you will work on incorporating previous work into the project, and starting to build player interaction. You will also add a second player and make the game work turn by turn.

Please submit this assignment on GitHub Classroom. There will be an automated grader that will check the functionality of your submission. It will be helpful to come up with test cases, and we encourage you to share them amongst each other; this will make everyone’s code better and is actually how Quality Assurance (QA) can work in practice. However, this is an individual assignment and you cannot share code; submissions will be run against plagiarism detection tools. Additionally, we will be spot checking the code for good coding practices. It is expected your code does not contain (1) extraneous variables/code, (2) missing semicolons, (3) missing curly braces, (4) use of double equals, (5) use of let when a const would suffice, (6) use of var. Furthermore, you should use whitespace consistently and to make the code legible. Now that you’ve learned how to use ESLint it should be easy to satisfy these requirements.

Since this part builds on your work from HW6, we will not include any files in the template; you should just copy your previous work. You are welcome to use our solution to the previous homework when it is posted.

## Starting Up

Visit the GitHub Classroom link: https://classroom.github.com/a/iDR5c3yO

After you click the link, accept the assignment, and your repository is created, clone that repository to your computer to begin work. Open the repository folder in VSCode (not just a single file). You will find the following files in your git repository folder in the Explorer side panel:

- **`README.md`**: this file contains markdown text; always included in a git repository.
- **`dictionary.json`**: the dictionary data used by the scrabble game.

After you clone the homework repository, you will need to install the Live Server VSCode extension if you haven’t already. You do this by clicking on the left panel in VSCode to reveal the Extensions panel.

You can then right click on an HTML file in the Explorer view and select _Open with Live Server_:

This will automatically start a web server in the background and open a browser window connected to that server. You can then open the developer tools to view the console. As you edit your code it will automatically reload the browser and run your latest code. Um, cool.

## Loading the JSON dictionary in the browser

In HW6 you imported **`dictionary.js`** into **`main.js`**. However, importing the dictionary as a JavaScript file was a quick fix. What we really want to do is represent the dictionary data as JSON and load in that JSON file over HTTP. To load the dictionary as a JSON file into the browser, your code will need to make an HTTP request in JavaScript to fetch the dictionary.json file. This used to be fairly complex, but luckily with modern APIs, it is almost trivial: use the fetch API. We recommend you load the dictionary before executing anything else (like initializing the board, etc.), and set it as a global variable. After you implement the fetch functionality you need to delete the import from HW6.

**Note:** If you are importing **`dictionary.js`** into **`scrabbleUtils.js`** for your **`isValid`** function, please use the fetch API in **`scrabbleUtils.js`** instead of using an **`import`** statement for the dictionary.

## Adding a second player and making the game turn-based

In this second and final part, you will add a second player to the game. In the original Scrabble, you can only see your own tiles, whereas here we will just show both player’s tiles on the screen. The second player needs their own rack of tiles. Both players should be able to name themselves via an input field next to their rack. You will then make the game turn-based by letting each player play one after another and by displaying a message indicating whose turn it is. We will not enforce rules yet (having to play a word in the center first / building on previous tiles after) or fix our score calculation: you will implement this in a later homework.

The players should now be able to place words turn by turn (first player, second player, first player, …). You should also edit your hint functionality so that it shows a hint relevant to the correct player’s tiles.

In the image to the left, Player 1 just took a first turn, and Player 2 just clicked the **“Help!”** button.
