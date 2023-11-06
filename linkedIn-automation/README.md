# LinkedIn Sales Navigator Automation Script

## Overview

This JavaScript script is designed to enhance the functionality of LinkedIn Sales Navigator by automating various tasks. It interacts with the LinkedIn Sales Navigator web interface, integrates with Google Sheets for data retrieval, and provides additional features for managing leads and interactions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Classes](#classes)
- [Functions](#functions)
- [Google Sheets Integration](#google-sheets-integration)
- [Element Detection](#element-detection)
- [Color Coding](#color-coding)
- [Examples](#examples)
- [License](#license)

## Installation

1. **Install a userscript manager:**
   - Before using the script, you need to install a userscript manager in your browser. Popular choices include [Tampermonkey](https://www.tampermonkey.net/) for Chrome and Firefox.
  
2. **Copy and Paste:**
   - Copy the script and paste it into the userscript manager. The script will be executed when you access LinkedIn Sales Navigator.

## Usage

This script is intended to automate tasks on the LinkedIn Sales Navigator platform, making lead management more efficient. It's crucial to use the script responsibly and in compliance with LinkedIn's terms of service.

## Classes

### Texts

The `Texts` class manages text templates used for generating messages. It provides a centralized way to handle message content and subject lines in different languages.

### Flows

The `Flows` class handles lead flows and their associated properties. It provides methods to retrieve flow details and properties based on the lead's status.

### People

The `People` class manages information about individuals, including their interactions, status, and profile details. It facilitates the creation and updating of user profiles.

## Functions

- **sendAlert(message, type):**
  - Sends an alert message if a specific type is not already in the alerts list.

- **calculateTimeDifferenceISO(pastTimeIso, addHours = 0):**
  - Calculates the time difference between two ISO formatted timestamps.

- **addStatsForExisting(person, element, addBtns = true):**
  - Adds status information and buttons for an existing person.

- **dropdownToggle(display, person):**
  - Toggles the dropdown menu for changing user status.

- **addButtonsForExisting(person):**
  - Adds buttons based on lead status for an existing person.

- **addButtonsAndStatsForNewChat(personInfo, element):**
  - Adds buttons and stats for a new chat.

- **addButtonsAndStatsForNew(minPerson, element):**
  - Adds buttons and stats for a new lead.


## Google Sheets Integration

The script interacts with Google Sheets to retrieve essential data. The `configureGoogleAuthVars` function initializes the necessary variables for Google Sheets authentication, and the `loadGoogleSheetsData` function loads data from specific sheets.

## Element Detection

The script employs the `waitForKeyElements` function to dynamically detect and interact with various elements on the LinkedIn Sales Navigator page. It identifies user rows, chat profiles, and people details to update or create corresponding objects.

## Color Coding

User rows on the "/sales/list/people/" page are color-coded based on specific conditions using the `updateColor` function. This visual distinction aids in quickly identifying leads that require attention.

## Examples

