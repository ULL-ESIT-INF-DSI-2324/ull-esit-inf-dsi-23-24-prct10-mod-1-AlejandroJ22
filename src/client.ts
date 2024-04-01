import net from "net";
// import {spawn} from 'child_process';

const client = net.connect({ port: 60300 });

let wholeData = "";
client.on("data", (dataChunk) => {
  wholeData += dataChunk;
});

// COMO mando un mensaje al server????
// client.on("");

client.on("end", () => {
  const message = wholeData.toString();

  console.log("Message received from server:", message);
//   if (message.type === "wc") {
//     console.log(`Connection established: counting file ${message.file}`);
//   } else if (message.type === "change") {
//     console.log("File has been modified.");
//     console.log(`Previous size: ${message.prevSize}`);
//     console.log(`Current size: ${message.currSize}`);
//   } else {
//     console.log(`Message type ${message.type} is not valid`);
//   }
});
