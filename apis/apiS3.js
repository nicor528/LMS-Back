const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { S3Client, ListBucketsCommand, ListObjectsCommand, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3RequestPresigner, getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Hash } = require("@aws-sdk/hash-node");
const { parseUrl } = require("@aws-sdk/url-parser");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { default: fetch } = require("node-fetch");
const { response } = require("express");


const s3Client = new S3Client({
    region: "eu-central-1", // Reemplaza con la región que corresponda
    credentials: fromIni({ profile: "bucket-eugenio-zing" }),
});


const presigner = new S3RequestPresigner({
    region: "eu-central-1", // Reemplaza con la región que corresponda
    credentials: fromIni({ profile: "bucket-eugenio-zing" }),
    sha256: Hash.bind(null, "sha256"),
 });

async function listarArchivosEnCarpeta(carpeta) {
    try {
      const command = new ListObjectsCommand({
        Bucket: "nombre-del-bucket",
        Prefix: carpeta + "/", // Agrega el "/" al final para listar solo los archivos dentro de la carpeta
      });
      const response = await s3Client.send(command);
      console.log(`Archivos en la carpeta ${carpeta}:`, response.Contents);
    } catch (err) {
      console.error("Error:", err);
    }
}

function getFiles (id) {
    return(
        new Promise (async (res, rej) => {
            const command = new ListObjectsV2Command({
                Bucket: "zingzang-files",
                Prefix: "outputs" + "/" + id + "/"
            })
            s3Client.send(command).then(result => {
                console.log(result);
                res(result)
            }).catch(error => {
                rej(error)
            })
        })
    )
}

async function generarEnlaceDeDescarga1(link) {
    const params = {
      Bucket: "zing-zang-vc",
      Key: link, // Reemplaza con la ruta correcta en S3
      Expires: 3600, // Duración del enlace en segundos (en este caso, 1 hora)
    };
  
    //const signer = new S3RequestPresigner({ ...s3Client.config });
    s3Client.send(new GetObjectCommand(params)).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })
  
    //const url = await signer.presign(request);
  
    //return url;
  }

  async function generarEnlaceDeDescarga(objectKey) {
    return (
        new Promise (async (res, rej) => {
            const url = parseUrl(`https://zing-zang-vc.s3.eu-central-1.amazonaws.com/${objectKey}`);

            // Genera el enlace prefirmado
            presigner.presign(new HttpRequest(url)).then(async (result) => {
                res(formatUrl(result))
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

async function actualizarEnlaces2(objetos) {
  const newArray = await Promise.all(objetos.map(async (objeto) => {
    const link = objeto.link;
    try {
      const result = await generarEnlaceDeDescarga(link);
      objeto.link = result;
      if(objeto.type === "IA"){
        const albumCoverLink = objeto.albumCover;
        const albumCoverResult = await generarEnlaceDeDescarga(albumCoverLink);
        objeto.albumCover = albumCoverResult;
      }
    } catch (error) {
      console.log(error)
    }
    return objeto;
  }));
  return newArray;
}

async function actualizarEnlaces(objetos) {
  const updatedObjects = await Promise.all(
    objetos.map(async (objeto) => {
      const tipo = objeto.M.type.S; // Suponiendo que el atributo es "type" y es de tipo String (S)
      console.log(objeto);
      // Verificar si el tipo es "IA" antes de actualizar el enlace
        const link = objeto.M.link.S;
        try {
          const result = await generarEnlaceDeDescarga(link);
          objeto.M.link.S = result;
          if (tipo === "IA"){
            const albumCoverLink = objeto.M.albumCover.S;
            const albumCoverResult = await generarEnlaceDeDescarga(albumCoverLink);
            objeto.M.albumCover.S = albumCoverResult;
          }
        } catch (error) {
          console.error("Error al generar el enlace de descarga:", error);
        }
      return objeto;
    })
  );

  return updatedObjects;


    /*return Promise.all(
      objetos.map(async (objeto) => {
        const tipo = objeto.M.type.S; // Suponiendo que el atributo es "type" y es de tipo String (S)
        console.log(objeto)
        // Verificar si el tipo es "IA" antes de actualizar el enlace
        if (tipo === "IA") {
          const link = objeto.M.link.S;
          generarEnlaceDeDescarga(link).then(result => {
            objeto.M.link.S = result;
            return objeto
          }).catch(error => {
            return objeto
          })
        }
        return objeto;
      })
    );*/
}

async function actualizarEnlacesVideos(objetos) {
    try {
      const newArray = await Promise.all(objetos.map(async (objeto) => {
        console.log(objeto)
        const link = objeto.M.link.S;
        const enlaceDeDescarga = await generarEnlaceDeDescarga(link);
        objeto.M.link.S = enlaceDeDescarga;
        return objeto;
      }));
      
      return newArray;
    } catch (error) {
      // Manejar errores si es necesario
      console.error("Error al actualizar enlaces:", error);
      throw error; // Lanzar el error nuevamente si es necesario
    }
}

async function actualizarEnlacesVideos2(objetos) {
  try {
    const newArray = await Promise.all(objetos.map(async (objeto) => {
      console.log(objeto)
      const link = objeto.link;
      const enlaceDeDescarga = await generarEnlaceDeDescarga(link);
      objeto.link = enlaceDeDescarga;
      return objeto;
    }));
    
    return newArray;
  } catch (error) {
    // Manejar errores si es necesario
    console.error("Error al actualizar enlaces:", error);
    throw error; // Lanzar el error nuevamente si es necesario
  }
}


async function test (){

    const linkDeDescarga = await generarEnlaceDeDescarga("outputs/MjrK0Yx7O2UlkLqU/apple.png");
    console.log(linkDeDescarga)
}

async function saveInS3 (id, nombreArchivo, link) {
  return(
    new Promise (async (res, rej) => {
      descargarArchivoConFetch(link).then(file => {
        console.log(file)
        const params = {
          Bucket: "zing-zang-vc",
          Key: "textSongs/" + id + "/" + nombreArchivo + ".mp3",
          Body: file,
        };
        s3Client.send(new PutObjectCommand(params)).then(result => {
          console.log(result)
          const path = "textSongs/" + id + "/" + nombreArchivo + ".mp3"
          res(path)
        }).catch(error => {
          console.log(error + "test");
          rej(error)
        })
      }).catch(() => {
        rej()
      })
    })
  )
}
//https://static-eu.gcp.mubert.com/b2b/recorder/zingzanglab/dd1ded6730bd4f37894d0723735f9b27.mp3
async function descargarArchivoConFetch(enlace) {
  return(
    new Promise(async (res, rej) => {
      await fetch(enlace).then(async (response) => {
        console.log(response)
        if(!response.ok){
          console.log(response.statusText)
          rej()
        }else{
          const archivoDescargado = await response.buffer();
          res (archivoDescargado);
        }
      })
    })
  )
  try {
    // Realiza la solicitud HTTP GET para descargar el archivo
    const response = await fetch(enlace);

    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`);
    }

    // Lee el contenido de la respuesta como un Buffer
    const archivoDescargado = await response.buffer();

    return archivoDescargado;
  } catch (error) {
    console.error(`Error al descargar el archivo:`, error);
    throw error;
  }
}



module.exports = {
  getFiles,
  actualizarEnlaces,
  test,
  actualizarEnlacesVideos,
  generarEnlaceDeDescarga,
  saveInS3,
  actualizarEnlaces2,
  actualizarEnlacesVideos2

}