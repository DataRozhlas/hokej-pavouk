import AWS from "aws-sdk";
import sharp from "sharp";
import md5Hex from "md5-hex";

const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

const countryNames = {
  at: "Rakousko",
  ca: "Kanada",
  ch: "Švýcarsko",
  cz: "Česko",
  de: "Německo",
  dk: "Dánsko ",
  fi: "Finsko",
  fr: "Francie",
  gb: "Británie",
  it: "Itálie",
  lv: "Lotyšsko",
  no: "Norsko",
  se: "Švédsko",
  sk: "Slovensko",
  us: "USA",
  by: "Bělorusko",
  kz: "Kazachstán",
  hu: "Maďarsko",
  si: "Slovinsko",
};

const coords = [
  [205, 103],
  [205, 150],
  [205, 230],
  [205, 278],
  [205, 378],
  [205, 427],
  [205, 507],
  [205, 555],
  [443, 168],
  [443, 215],
  [443, 444],
  [443, 491],
  [680, 234],
  [680, 280],
  [680, 417],
  [680, 466],
  [915, 256],
];

function determine_font(event, i) {
  if (
    ((i === 0 || i === 1) && event[i] === event[8]) ||
    ((i === 2 || i === 3) && event[i] === event[9]) ||
    ((i === 4 || i === 5) && event[i] === event[10]) ||
    ((i === 6 || i === 7) && event[i] === event[11]) ||
    ((i === 8 || i === 9) && event[i] === event[12]) ||
    ((i === 10 || i === 11) && event[i] === event[13]) ||
    ((i === 12 || i === 13) && event[i] === event[16]) ||
    i === 14 ||
    i === 16
  ) {
    return "Arial Bold";
  }
  return "Arial";
}

async function processImage(event) {
  try {
    // přidání vlajek

    const flags = event.map((country, index) => {
      return {
        input: `./img/flags/${country}.svg`,
        left: coords[index][0] - 48,
        top: coords[index][1] - 1,
      };
    });

    const withflags = await sharp("./img/canvas.png")
      .composite(flags)
      .toBuffer();

    // vytvoření obrázků z názvů zemí

    const textPics = await Promise.all(
      event.map((country, i) => {
        return sharp({
          text: {
            text: countryNames[country],
            dpi: 110,
            font: determine_font(event, i),
          },
        })
          .negate()
          .unflatten()
          .png()
          .toBuffer();
      })
    );

    // přidání názvů zemí
    const countries = event.map((country, index) => {
      return {
        input: textPics[index],
        left: coords[index][0] - 5,
        top: coords[index][1] + 5,
      };
    });

    const result = await sharp(withflags).composite(countries).toBuffer();

    return result;
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

export const handler = async (event) => {
  try {
    const tip = JSON.parse(event.body);

    // zapsat tip do dynamoDB
    await dynamo
      .put({
        TableName: "ms-hokej-23",
        Item: {
          uid: Date.now() + Math.random(),
          tip: JSON.stringify(tip),
        },
      })
      .promise();

    // ověřit existenci obrázku
    const hash = md5Hex(tip);
    const exists = await s3
      .headObject({
        Bucket: "ms-hokej-23",
        Key: `${hash}.png`,
      })
      .promise()
      .then(
        () => true,
        (err) => {
          if (err.code === "NotFound") {
            return false;
          }
          throw err;
        }
      );

    if (exists) {
      return "https://ms23.cz/" + hash + ".html";
    }

    const processedImage = await processImage(tip);

    await s3
      .upload({
        Bucket: "ms-hokej-23",
        Key: `${hash}.png`,
        Body: processedImage,
        ACL: "public-read",
        ContentType: "image/png",
        ContentDisposition: "attachment; filename:'hokej_tip.png'",
      })
      .promise();

    await s3
      .upload({
        Bucket: "ms-hokej-23",
        Key: `${hash}.html`,
        Body: `<!DOCTYPE html>
        <meta charset="UTF-8">
        <meta property="og:url" content="${`https://ms23.cz/${hash}.html`}" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Šampionát letos vyhraje ${
          countryNames[tip[tip.length - 1]]
        }" />
        <meta property="og:description" content="Tipněte si, jak dopadne mistrovství světa v hokeji!" />
        <meta property="og:image" content="${`https://ms23.cz/${hash}.png`}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@irozhlascz">
        <meta name="twitter:creator" content="@datarozhlas">
        <meta name="twitter:title" content="Šampionát letos vyhraje ${
          countryNames[tip[tip.length - 1]]
        }">
        <meta name="twitter:description" content="Tipněte si, jak dopadne mistrovství světa v hokeji!">
        <meta name="twitter:image" content="${`https://ms23.cz/${hash}.png`}">
        <script>window.location.replace("https://www.irozhlas.cz/node/8987676");</script>`,
        ACL: "public-read",
        ContentType: "text/html",
      })
      .promise();

    return "https://ms23.cz/" + hash + ".html";
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: "An error occurred while uploading the image",
    };
  }
};
