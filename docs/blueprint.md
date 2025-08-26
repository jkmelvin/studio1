# **App Name**: NFC Connect

## Core Features:

- NFC Read: Display the data read from an NFC tag.
- NFC Write: Allow the user to enter data to be written to an NFC tag.
- MQTT Settings: Configure the MQTT broker URL and topic.
- MQTT Data Transmission: Automatically send NFC data to the configured MQTT broker when a tag is read.
- Local Storage of MQTT settings: Save and retrieve MQTT settings from local storage in the browser.

## Style Guidelines:

- Primary color: Blue (#29ABE2) to reflect connectivity and data transfer, suggesting reliability.
- Background color: Light gray (#F0F0F0), a desaturated form of the primary blue.
- Accent color: A vibrant lime green (#32CD32) to indicate active NFC connection or successful data transfer.
- Font pairing: 'Space Grotesk' (sans-serif) for headings and 'Inter' (sans-serif) for body text, providing a clean and modern look.
- Use simple, outlined icons from a set like Material Icons for navigation and NFC status indicators.
- Tabbed interface for 'NFC Read', 'NFC Write', and 'Settings', with a clear, full-width display area for NFC data.
- Use subtle animations like a loading spinner while waiting for NFC tag detection.