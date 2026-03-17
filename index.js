/**
 * Punto de entrada de la aplicación.
 * Conecta a MongoDB, ejecuta el seed de admin por defecto e inicia el servidor HTTP.
 */
import { env } from './configs/app.js';
import { connectMongo } from './configs/mongo.js';
import app, { BASE_PATH } from './configs/server.js';
import { checkAndCreateDefaultAdmin } from './seeds/admin.seed.js';

const startApp = async () => {
    try {
        await connectMongo();
        await checkAndCreateDefaultAdmin();

        app.listen(env.PORT, () => {
            console.log(`\n  Servidor corriendo en http://localhost:${env.PORT}`);
            console.log(`  Health:  http://localhost:${env.PORT}${BASE_PATH}/health`);
            console.log(`  Auth:    http://localhost:${env.PORT}${BASE_PATH}/auth/login\n`);
        });
    } catch (error) {
        console.error('No se pudo iniciar la aplicación:', error.message);
        process.exit(1);
    }
};

startApp();
