import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // URL 1 o URL 2: Cambia según la que quieras probar
  const url = " https://flaswish.com/e/x3yfpzn5uqfs";

  await page.goto(url, { waitUntil: "networkidle2" });

  // Espera que el video esté disponible
  await page.waitForSelector("video");

  // Extraer el Blob URL
  const videoBlobUrl = await page.evaluate(() => {
    const videoElement = document.querySelector("video");
    return videoElement ? videoElement.src : null;
  });

  console.log("Blob URL del video:", videoBlobUrl);

  if (videoBlobUrl && videoBlobUrl.startsWith("blob:")) {
    console.log("Descargando contenido del blob...");

    // Descarga el contenido del blob
    const videoContent = await page.evaluate(async (blobUrl) => {
      const response = await fetch(blobUrl);
      const buffer = await response.arrayBuffer();
      return Array.from(new Uint8Array(buffer));
    }, videoBlobUrl);

    // Escribe el contenido en un archivo MP4
    fs.writeFileSync("video.mp4", Buffer.from(videoContent));
    console.log("Video descargado exitosamente como 'video.mp4'.");
  } else {
    console.log("No se encontró un Blob URL o no es necesario descargarlo.");
  }

  // Interceptar solicitudes para capturar URLs MP4 si están disponibles
  let mp4Url = null;
  page.on("response", async (response) => {
    const requestUrl = response.url();
    if (requestUrl.includes(".mp4")) {
      mp4Url = requestUrl;
      console.log("URL MP4 capturada:", mp4Url);

      // Descarga el archivo MP4 directamente
      const mp4Response = await page.goto(mp4Url);
      const mp4Buffer = await mp4Response.buffer();
      fs.writeFileSync("direct-video.mp4", mp4Buffer);
      console.log("Video descargado exitosamente como 'direct-video.mp4'.");
    }
  });

  // Reproducir el video para activar solicitudes de red
  await page.evaluate(() => {
    const video = document.querySelector("video");
    if (video) video.play();
  });

  // Esperar un tiempo para capturar posibles solicitudes
  await new Promise((resolve) => setTimeout(resolve, 10000));

  await browser.close();

  if (!mp4Url) {
    console.log("No se capturó ninguna URL MP4 directa.");
  }
})();