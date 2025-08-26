# NFC Connect

This is a Next.js web application that allows you to read and write data to NFC tags using your device's NFC reader. It can also be configured to send the data read from NFC tags to an MQTT broker.

## Features

- **Read NFC Tags**: Scans and displays data from NFC tags.
- **Write to NFC Tags**: Writes user-provided text to NFC tags.
- **MQTT Integration**: Sends NFC data to a configured MQTT broker.
- **Settings**: Configure and save MQTT broker details (URL and topic) in your browser's local storage.

**Note on Browser Support**: This application relies on the Web NFC API, which is currently supported in Chrome on Android. For security reasons, the Web NFC API is only available on websites served over HTTPS.

---

## Local Development and Testing Setup

You can run this web application on your local machine (like a laptop) for development and testing. This allows you to access the app from a mobile device (like an Android phone) on the same local network.

### Prerequisites

1.  A computer with Node.js and npm installed.
2.  A mobile device with an NFC reader and a supported browser (e.g., Chrome for Android).
3.  Your computer and mobile device must be connected to the same Wi-Fi network.

### 1. Install Dependencies

Navigate to the project directory in your terminal and install the required packages:

```bash
npm install
```

### 2. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

This will start the application, typically on port 9002. You'll see output in your terminal like:

```
- ready started server on 0.0.0.0:9002, url: http://localhost:9002
```

### 3. Find Your Local IP Address

To access the app from your mobile phone, you'll need your computer's local IP address.

- **On macOS:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **On Windows:** `ipconfig | findstr "IPv4 Address"`
- **On Linux:** `hostname -I` or `ip a`

Look for an address that starts with `192.168.x.x`, `10.x.x.x`, or `172.16.x.x`.

### 4. Access the App from Your Phone

On your Android phone, open Chrome and navigate to the address from the previous step, including the port number. For example: `http://192.168.1.10:9002`.

You should now see the NFC Connect application.

### Important: Enabling HTTPS for Web NFC

The Web NFC API requires a secure context (HTTPS). The development server runs on HTTP, so the NFC features **will not work** by default.

For local testing, the easiest solution is to use a tool like **`mkcert`** to create a trusted local certificate and then configure the Next.js development server to use it. This is an advanced setup but necessary for testing the NFC functionality. Running the app on a platform like Firebase App Hosting (which provides HTTPS automatically) is an easier alternative for a deployed environment.

### 5. Optional: Running a Local MQTT Broker

To test the MQTT integration, you can run a broker on your local machine. [Mosquitto](https://mosquitto.org/) is a popular choice.

1.  **Install Mosquitto:**
    -   **macOS:** `brew install mosquitto`
    -   **Windows/Linux:** Follow the official installation guide.

2.  **Configure for WebSocket Support:**
    The app connects to MQTT over WebSockets. Create a `mosquitto.conf` file with the following content:

    ```conf
    # Listener for standard MQTT
    listener 1883

    # Listener for WebSockets
    listener 9001
    protocol websockets
    ```

3.  **Run Mosquitto:**
    Start the broker with your configuration file:
    ```bash
    mosquitto -c /path/to/your/mosquitto.conf
    ```

4.  **Configure the App:**
    In the NFC Connect app's settings, use your computer's IP address as the broker URL with the WebSocket protocol and port. For example: `ws://192.168.1.10:9001`.
