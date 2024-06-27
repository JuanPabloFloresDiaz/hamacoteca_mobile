import * as Constantes from './constantes';

// Función que maneja las peticiones para traer las imágenes de mi API
export default async function imageData(folder, filename) {
    // URL base del servidor
    const SERVER_URL = Constantes.IMAGES_URL;
    // Construir la URL completa de la imagen
    const imageUrl = `${SERVER_URL}${folder}/${filename}`;
    try {
        return imageUrl; // Retornar la URL de la imagen si está disponible
    } catch (error) {
        console.error('Imagen error:', error);
        throw error; // Lanza el error para que useEffect pueda manejarlo
    }
};
