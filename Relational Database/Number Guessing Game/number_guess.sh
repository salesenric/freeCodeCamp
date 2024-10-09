#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

# Ask for username
echo "Enter your username:"

# Read username
read USERNAME

# Query user
USER=$($PSQL "SELECT username, games_played, best_game FROM users WHERE username='$USERNAME'")

# Check if user found
if [[ -z $USER ]]
then
  # User not found
  echo "Welcome, $USERNAME! It looks like this is your first time here."
  # Insert user
  INSERT_USER=$($PSQL "INSERT INTO users(username,games_played,best_game) VALUES('$USERNAME',1,0)")
else
  # User found
  # User games_played + 1
  UPDATE_GAMES_PLAYED=$($PSQL "UPDATE users SET games_played=games_played+1 WHERE username='$USERNAME'")
  
  IFS="|" read USERNAME GAMES_PLAYED BEST_GAME <<< "$USER"
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

# Generate a random number between 1 and 1000
RANDOM_NUMBER=$(( (RANDOM % 1000) + 1 ))

# Ask for guess
echo "Guess the secret number between 1 and 1000:"

# Init count variable
COUNT=0

# Function for game logic
GAME(){
  while true; do
    # Read guess
    read GUESS

    # Check if user guess is numeric
    if [[ $GUESS =~ ^[0-9]+$ ]]
    then
      # Increment count
      ((COUNT++))

      if [[ $GUESS -gt $RANDOM_NUMBER ]]
      then
        echo "It's lower than that, guess again:"
      elif [[ $GUESS -lt $RANDOM_NUMBER ]]
      then
        echo "It's higher than that, guess again:"
      else
        # User guessed it correctly
        echo "You guessed it in $COUNT tries. The secret number was $RANDOM_NUMBER. Nice job!"

        # Update user best_game if necessary
        BEST_GAME=$($PSQL "SELECT best_game FROM users WHERE username='$USERNAME'" | xargs)
        if [[ $COUNT -lt $BEST_GAME ]] || [[ $BEST_GAME -eq 0 ]]
        then
          UPDATE_BEST_GAME=$($PSQL "UPDATE users SET best_game=$COUNT WHERE username='$USERNAME'")
        fi
        break
      fi
    else
      echo "That is not an integer, guess again:"
    fi
  done
}

# Function call
GAME
