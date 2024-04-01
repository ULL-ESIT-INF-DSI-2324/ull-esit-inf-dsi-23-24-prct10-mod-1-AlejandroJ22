import net from "net";
import { spawn } from "child_process";

net
  .createServer((connection) => {
    console.log("A client has connected.");

    connection.write(`Connection established.`);

    connection.on("data", (data) => {
      // message es un string que debo analizar y actuar en consecuencia:
      const message: string = data.toString();
      const parts = message.split(" ");

      if (parts.length >= 3) {
        const command = parts[0];
        const option = parts[1];
        const filename = parts[2];

        if (command == "wc") {
          const wc = spawn("wc", [option, filename]);
          let wcOutput = "";
          wc.stdout.on("data", (piece) => (wcOutput += piece));

          wc.on("close", () => {
            const wcOutputAsArray = wcOutput.split(/\s+/);
            connection.write(
              `File ${filename} has ${wcOutputAsArray[1]} lines`,
            );
            connection.write(
              `File ${filename} has ${wcOutputAsArray[2]} words`,
            );
            connection.write(
              `File ${filename} has ${wcOutputAsArray[3]} characters`,
            );
          });

          wc.on("error", (err) => {
            // Escritura en server
            process.stderr.write(err.message);
            // Escritura en cliente
            connection.write(err.message);
          });
        } else if (parts.length == 1) {
            const command = parts[0];
            if (command == "ls") {
              const ls = spawn("ls");
              ls.on("close", (output) => {
                if (output != undefined) connection.write(output.toString());
              });

              ls.on("error", (err) => {
                // Escritura en server
                process.stderr.write(err.message);
                // Escritura en cliente
                connection.write(err.message);
              });
            }
        } else {
          connection.write("Wrong command.");
        }

        //   const message = JSON.parse(dataJSON.toString());
        //   if (message.command == "wc") {
        //     const wc = spawn("wc", [message.option, message.filename]);

        //     let wcOutput = "";
        //     wc.stdout.on("data", (piece) => (wcOutput += piece));

        //     wc.on("close", () => {
        //       const wcOutputAsArray = wcOutput.split(/\s+/);
        //       //   connection.write(
        //       //     JSON.stringify({
        //       //       type: "wc",
        //       //       file: `${message.file}`,
        //       //       lines: `${wcOutputAsArray[1]}`,
        //       //       words: `${wcOutputAsArray[2]}`,
        //       //       characters: `${wcOutputAsArray[3]}`,
        //       //     }),
        //       //   );
        //       connection.write(
        //         `File ${message.file} has ${wcOutputAsArray[1]} lines`,
        //       );
        //       connection.write(
        //         `File ${message.file} has ${wcOutputAsArray[2]} words`,
        //       );
        //       connection.write(
        //         `File ${message.file} has ${wcOutputAsArray[3]} characters`,
        //       );
        //       //   console.log(`File helloworld.txt has ${wcOutputAsArray[1]} lines`);
        //       //   console.log(`File helloworld.txt has ${wcOutputAsArray[2]} words`);
        //       //   console.log(
        //       //     `File helloworld.txt has ${wcOutputAsArray[3]} characters`,
        //       //   );
        //     });

        //     wc.on("error", (err) => {
        //       // Escritura en server
        //       process.stderr.write(err.message);
        //       // Escritura en cliente
        //       connection.write(err.message);
        //     });
      } else {
        console.log("Undefined command has been rejected.");
        connection.write("Undefined command.");
      }
    });

    // const stdin = process.openStdin();
    // let command: string = "";

    // stdin.addListener("data", (data) => {
    //   option += data.toString();
    // });

    connection.on("close", () => {
      console.log("A client has disconnected.");
    });
  })
  .listen(60300, () => {
    console.log("Waiting for clients to connect.");
  });
