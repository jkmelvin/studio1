# NFC Connect

This is a Next.js web application that allows you to read and write data to NFC tags using your device's NFC reader. It can also be configured to send the data read from NFC tags to an MQTT broker.

## Features

- **Read NFC Tags**: Scans and displays data from NFC tags.
- **Write to NFC Tags**: Writes user-provided text to NFC tags.
- **MQTT Integration**: Sends NFC data to a configured MQTT broker.
- **Settings**: Configure and save MQTT broker details (URL and topic) in your browser's local storage.

**Note on Browser Support**: This application relies on the Web NFC API, which is currently supported in Chrome on Android. The device running the browser must have an NFC reader. For security reasons, the Web NFC API is only available on websites served over HTTPS.

## Setup on a Raspberry Pi

You can run this web application on a Raspberry Pi, which can act as a local web server. This allows you to access the app from a mobile device (like an Android phone) on the same network.

### Prerequisites

1.  A Raspberry Pi with Raspberry Pi OS.
2.  Node.js and npm installed on the Raspberry Pi.
3.  A mobile device with an NFC reader and a supported browser (e.g., Chrome for Android).

### Steps

1.  **Install Node.js and npm:**

    If you don't have Node.js and npm installed on your Raspberry Pi, you can install them using NodeSource:

    ```bash
    # Download and import the Nodesource GPG key
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

    # Create deb repository
    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

    # Run Update and Install
    sudo apt-get update
    sudo apt-get install nodejs -y
    ```

2.  **Clone the Repository:**

    Clone this project onto your Raspberry Pi.

    ```bash
    git clone <your-repository-url>
    cd nfc-connect # Or your project directory name
    ```

3.  **Install Dependencies:**

    ```bash
    npm install
    ```

4.  **Build the Application:**

    ```bash
    npm run build
    ```

5.  **Start the Production Server:**

    ```bash
    npm start
    ```

    By default, the app will run on port 3000.

6.  **Access the App:**

    Find your Raspberry Pi's local IP address:

    ```bash
    hostname -I
    ```

    From your mobile device connected to the same Wi-Fi network, open a web browser and navigate to `http://<raspberry_pi_ip_address>:3000`.

### Important: Enabling HTTPS for Web NFC

The Web NFC API requires a secure context (HTTPS). The standard `npm start` command serves the site over HTTP. To use the NFC features, you must serve the application over HTTPS.

This typically involves setting up a reverse proxy like **Nginx** or **Caddy** on your Raspberry Pi to handle SSL/TLS encryption. You can use self-signed certificates for a local network or a service like Let's Encrypt for a public domain. This setup is advanced but necessary for the NFC functionality to work.

### Optional: Running an MQTT Broker

Your Raspberry Pi is also an excellent device for running an MQTT broker like [Mosquitto](https://mosquitto.org/). You can install it on your Pi and then use its local IP address in the NFC Connect app's settings.

```bash
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients
```
