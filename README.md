# NFC Connect

This is a Next.js web application that allows you to read and write data to NFC tags using your device's NFC reader. It can also be configured to send the data read from NFC tags to an MQTT broker.

## Features

- **Read NFC Tags**: Scans and displays data from NFC tags.
- **Write to NFC Tags**: Writes user-provided text to NFC tags.
- **MQTT Integration**: Sends NFC data to a configured MQTT broker.
- **Settings**: Configure and save MQTT broker details (URL and topic) in your browser's local storage.

**Note on Browser Support**: This application relies on the Web NFC API, which is currently supported in Chrome on Android. For security reasons, the Web NFC API is only available on websites served over a secure context (HTTPS).

---

## Local Development and Testing Setup

You can run this web application on your local machine (like a laptop or Raspberry Pi) for development and testing. This allows you to access the app from a mobile device (like an Android phone) on the same local network.

### Prerequisites

1.  A computer/server (like a Raspberry Pi) with Node.js and npm installed.
2.  A mobile device with an NFC reader and a supported browser (e.g., Chrome for Android).
3.  Your computer and mobile device must be connected to the same Wi-Fi network.

### 1. Install Dependencies

Navigate to the project directory in your terminal and install the required packages:

```bash
npm install
```

### 2. Find Your Local IP Address

To access the app from your mobile phone, you'll need your computer's or Raspberry Pi's local IP address.

- **On macOS:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **On Windows:** `ipconfig | findstr "IPv4 Address"`
- **On Linux/Raspberry Pi:** `hostname -I` or `ip a`

Look for an address that starts with `192.168.x.x`, `10.x.x.x`, or `172.16.x.x`.

### 3. Run the Development Server with HTTPS

The Web NFC API requires a secure connection (HTTPS). The standard `npm run dev` command starts an HTTP server. To test NFC, you must serve the application over HTTPS.

The easiest way to do this is to use `mkcert` to create a locally-trusted development certificate.

**A. Install `mkcert`**

Follow the installation instructions for your operating system on the [mkcert GitHub page](https://github.com/FiloSottile/mkcert). For example, on macOS with Homebrew: `brew install mkcert`. On Linux: you may need to install `certutil`.

**B. Create a local Certificate Authority (CA)**

Run this command once:
```bash
mkcert -install
```
This will install a local CA in your system's trust stores. You might be prompted for your password.

**C. Generate a Certificate for Your Server**

In your project folder, run the following command. Replace `your.pi.ip.address` with the actual local IP address you found in step 2. You can add more hostnames if needed (e.g., `localhost`).

```bash
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1 your.pi.ip.address
```
This will create two files in your project directory: `key.pem` and `cert.pem`.

**D. Start the HTTPS Development Server**

Now, run the development server with flags pointing to your new certificate files:
```bash
next dev --turbopack -p 9002 --experimental-https --https-key ./key.pem --https-cert ./cert.pem
```

This will start the application on port 9002, but this time using HTTPS.

### 4. Access the App from Your Phone

On your Android phone, open Chrome and navigate to the **HTTPS** address from the previous step. For example: `https://192.168.1.10:9002`.

You should now see the NFC Connect application with a valid HTTPS connection, and the NFC functionality should work.

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
